const fileService = require('../files/files.service');
const { Jimp } = require('jimp');
const build = require('./spectrogram')
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5000 * 1024
  }
});
const spectrogramService = require('./spectrogram.service');
const logger = require('../../common/logging');


router.post('/', async (req, res) => {
  const { rate, amplifier, cutOff, name, mobile, filter } = req.body;

  logger.info(`Spectrogram request received for: ${name}`);
  logger.info(`Request body: ${JSON.stringify({
    rate, amplifier, cutOff, mobile, filter
  })}`);
  
  if (!name) {
    logger.error('No name provided in request');
    return res.status(400).send({ error: 'Name parameter is required' });
  }
  
  const spectrogramKey = `ADE-SPECTROGRAMS/${name}`;
  
  try {
    const exists = await fileService.objectExists(spectrogramKey + '/spectrogram.png') && await fileService.objectExists(spectrogramKey + '/waveform.json')
    
    if (exists) {
      const spectrogramUrl = await fileService.getPresignedUrlIfExists(spectrogramKey + '/spectrogram.png');
      const waveformUrl = await fileService.getPresignedUrlIfExists(spectrogramKey + '/waveform.json');

      logger.info(`Returning existing spectrogram URL for ${name}`);
      return res.status(OK).send({ 
        spectrogramUrl, 
        waveformUrl,
      });
    }

    logger.info(`Spectrogram not found for ${name}, generating new one`);
    try {
      const stream = await fileService.streamWavFile(name);
      const buffer = await streamToBuffer(stream);
       
      const visualisation = build(buffer, {})
      const vizBuffer = await visualisation.spectrogram.image.getBuffer("image/png")

      await fileService.uploadFile(spectrogramKey + '/spectrogram.png', vizBuffer);
      await fileService.uploadFile(spectrogramKey + '/waveform.json', JSON.stringify(visualisation.wave))

      const spectrogramUrl = await fileService.getPresignedUrlIfExists(spectrogramKey + '/spectrogram.png');
      const waveformUrl = await fileService.getPresignedUrlIfExists(spectrogramKey + '/waveform.json');
      
      logger.info(`Generated and uploaded new spectrogram for ${name}`);

      return res.status(OK).send({ 
        spectrogramUrl, 
        waveformUrl,
      });
    } catch (streamError) {
      logger.error(`Error streaming or processing file ${name}: ${streamError.message}`);
      return res.status(INTERNAL_SERVER_ERROR).send({ 
        error: 'Failed to process audio file',
        details: streamError.message
      });
    }
  } catch (error) {
    logger.error(`Error generating spectrogram for ${name}: ${error.message}`);
    res.status(INTERNAL_SERVER_ERROR).send({ 
      error: 'Failed to generate spectrogram',
      details: error.message
    });
  }
});

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

module.exports = router;
