import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, ReadStream } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('node:path');
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Speaker = require('speaker');
import ISpeaker from 'speaker';
import { parseStream } from 'music-metadata';

/**
 * channels - The number of audio channels. PCM data must be interleaved. Defaults to 2.
    bitDepth - The number of bits per sample. Defaults to 16 (16-bit).
    sampleRate - The number of samples per second per channel. Defaults to 44100.
    signed - Boolean specifying if the samples are signed or unsigned. Defaults to true when bit depth is 8-bit, false otherwise.
    float - Boolean specifying if the samples are floating-point values. Defaults to false.
    samplesPerFrame - The number of samples to send to the audio backend at a time. You likely don't need to mess with this value. Defaults to 1024.
    device - The name of the playback device. E.g. 'hw:0,0' for first device of first sound card or 'hw:1,0' for first device of second sound card. Defaults to null which will pick the default device.
 */

@Injectable()
export class PlayerService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}
  private speaker?: ISpeaker;
  private currentAudioStream?: ReadStream;

  async play(trackId: number) {
    const track = await this.trackRepository.findOneOrFail({
      where: { id: trackId },
    });
    const path =
      '/Users/harryshapiro/developer/personal/record-collection/packages/backend/dev-audio-dir/sample3.flac' ||
      (await this.resolveAbsolutePathToTrack(track.relativeFilePath));
    const audioFileHeaders = await parseStream(createReadStream(path));

    const speakerConfig = {
      channels: audioFileHeaders.format.numberOfChannels || 2,
      bitDepth: audioFileHeaders.format.bitsPerSample || 16,
      sampleRate: audioFileHeaders.format.sampleRate || 44100,
    };

    this.speaker = new Speaker(speakerConfig) as ISpeaker;

    this.currentAudioStream = createReadStream(path);
    this.currentAudioStream.pipe(this.speaker);

    return 'success';
  }

  pause() {
    if (this.currentAudioStream) {
      this.currentAudioStream.close();
    }
  }

  skip() {}

  volumeUp() {}

  volumeDown() {}

  addToQueue() {}

  getQueue() {}

  resolveAbsolutePathToTrack(relativePath: string): string {
    const base = this.configService.get('AUDIO_DIR');
    return path.join(base, relativePath);
  }
}
