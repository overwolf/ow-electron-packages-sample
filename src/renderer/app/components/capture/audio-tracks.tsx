import React, { ChangeEvent, FC, useContext, useState } from 'react';
import AppContext from '../../context/app-context';
import { AudioTracks } from '@overwolf/ow-electron-packages-types';
import { audioTracksArray, kAudioTracksMapping } from './constants';
import { AudioTracksEnum } from '../../../../common/recorder/audio-trackes-enum';

const AudioTracksSelection: FC = () => {
  const { recordingOptions, setRecordingOptions } =
    useContext(AppContext)?.recording;
  const [selectedTracks, setSelectedTracks] = useState<AudioTracks[]>([]);

  const onButtonClick = (track: AudioTracks) => {
    setSelectedTracks([]);
    setRecordingOptions({
      ...recordingOptions,
      audioTrack: track,
    });
  };

  const onCheckBoxClick = (
    e: ChangeEvent<HTMLInputElement>,
    track: AudioTracks,
  ) => {
    let checked = e.target.checked;
    let selected = checked
      ? [...selectedTracks, track]
      : [...selectedTracks.filter((i) => i !== track)];

      setSelectedTracks(selected);

      let multiTracks: AudioTracks;
      for( const track of selected) {
        multiTracks = multiTracks | track;
      }

      setRecordingOptions({
        ...recordingOptions,
        audioTrack: multiTracks,
      });

  };


  return (
    <label>
      Audio Tracks:
      <button
        style={{
          backgroundColor:
            recordingOptions?.audioTrack === AudioTracksEnum.All ? 'green' : 'gray',
        }}
        onClick={() => onButtonClick(AudioTracksEnum.All)}
      >
        All
      </button>
      <button
        style={{
          backgroundColor:
            recordingOptions?.audioTrack === AudioTracksEnum.None
              ? 'green'
              : 'gray',
        }}
        onClick={() => onButtonClick(AudioTracksEnum.None)}
      >
        None
      </button>
      <br/>
      {audioTracksArray?.map((track) => {
        return (
          <label key={track}>
            <input
              key={track}
              checked={selectedTracks?.includes(track)}
              type="checkbox"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onCheckBoxClick(e, track);
              }}
            />
            {kAudioTracksMapping[track]}
          </label>
        );
      })}
    </label>
  );
};

export default AudioTracksSelection;
