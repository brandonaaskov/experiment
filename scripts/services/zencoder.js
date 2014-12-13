
angular.module('experiment').service('zencoder', function($http, firebase) {
  var baseUrl, createJob, getJobProgress, getOutputs, guid, keys, publicApi
  guid = firebase.guid
  baseUrl = 'https://app.zencoder.com/api/v2'
  keys = {
    read: '92cdc58ec35e590acb0980f75ddfa32c',
    full: '380e390b6b8fd2d600c9035db7d13c29'
  }
  createJob = function(filepath) {
    return $http.post("" + baseUrl + "/jobs", getOutputs(filepath))
  }
  getJobProgress = function(jobId) {
    return $http.get("" + baseUrl + "/jobs/" + jobId + "/progress.json?api_key=" + keys.full)
  }
  getOutputs = function(filepath) {
    var filename
    filename = _.getFilename(filepath)
    baseUrl = "s3://fullscreen-tv"
    return {
      input: "" + baseUrl + "/" + filepath,
      outputs: [
        {
          label: "low",
          format: "mp4",
          video_bitrate: 200,
          decoder_bitrate_cap: 300,
          decoder_buffer_size: 1200,
          audio_sample_rate: 44100,
          height: "288",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-low.mp4",
          h264_reference_frames: 1,
          forced_keyframe_rate: "0.1",
          audio_bitrate: 56,
          decimate: 2,
          rrs: true
        }, {
          label: "high",
          format: "mp4",
          video_bitrate: 1000,
          decoder_bitrate_cap: 1500,
          decoder_buffer_size: 6000,
          audio_sample_rate: 44100,
          height: "432",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-high.mp4",
          h264_reference_frames: "auto",
          h264_profile: "main",
          forced_keyframe_rate: "0.1",
          audio_bitrate: 56,
          rrs: true
        }, {
          source: "low",
          segment_video_snapshots: "true",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-audio-only.m4a",
          copy_audio: "true",
          skip_video: "true",
          label: "hls-audio-only",
          type: "segmented",
          format: "aac",
          rrs: true
        }, {
          source: "low",
          format: "ts",
          copy_audio: "true",
          copy_video: "true",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-hls-low.mp4",
          label: "hls-low",
          type: "segmented",
          rrs: true
        }, {
          source: "high",
          format: "ts",
          copy_audio: "true",
          copy_video: "true",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-hls-high.mp4",
          label: "hls-high",
          type: "segmented",
          rrs: true
        }, {
          streams: [
            {
              path: "hls-low/" + filename + "-hls-low.m3u8",
              bandwidth: 256
            }, {
              path: "hls-audio-only/" + filename + "-hls-audio-only.m3u8",
              bandwidth: 56
            }, {
              path: "hls-high/" + filename + "-hls-high.m3u8",
              bandwidth: 1056
            }
          ],
          type: "playlist",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + ".m3u8"
        }
      ]
    }
  }
  return publicApi = {
    createJob: createJob,
    getJobProgress: getJobProgress
  }
}).config(function($httpProvider) {
  $httpProvider.defaults.headers.common = {}
  $httpProvider.defaults.headers.post = {}
  return $httpProvider.defaults.headers.post['Zencoder-Api-Key'] = '380e390b6b8fd2d600c9035db7d13c29'
})
