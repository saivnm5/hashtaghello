import ImageCompressor from '@xkeshi/image-compressor';

var awsBucketName = 'hello-source';
var bucketRegion = 'ap-south-1';
var IdentityPoolId = 'ap-south-1:36e2fa0a-c646-43d6-b45d-002c1dac444d';

window.AWS.config.update({
  region: bucketRegion,
  credentials: new window.AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new window.AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: awsBucketName}
});

export function uploadPhoto(files, callbackObj) {
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = String(new Date() / 1000)+file.name;

  new ImageCompressor(file, {
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 1,
    success(result) {

      var params = {
        Key: fileName,
        Body: result,
        ACL: 'public-read'
      }
      s3.upload(params)
      .on('httpUploadProgress', function(evt) {
        var percentage = parseInt(((evt.loaded * 100) / evt.total), 10);
        callbackObj.progress(percentage);
      }).send(function(err, data) {
        if (err) {
          return alert('There was an error uploading your photo: ', err.message);
        }
        var imgKey = data.key;
        var shotIndex = callbackObj.shotIndex;
        callbackObj.success(imgKey, shotIndex);
      });

    },
    error(e) {
      console.log(e.message);
    },
  });

}

export function getImgUrl(imgKey, size) {
  /*var urlPrefix = 'https://hello-sourceresized.s3.ap-south-1.amazonaws.com/';
  if(size === 'thumbnail'){
    imgKey = 'thumb-'+imgKey;
  }
  else{
    imgKey = 'full-'+imgKey;
  }*/
  var urlPrefix = 'https://hello-source.s3.ap-south-1.amazonaws.com/';
  if(size === 'full'){
    urlPrefix = 'https://hello-sourceresized.s3.ap-south-1.amazonaws.com/';
    imgKey = 'full-'+imgKey;
  }
  return (urlPrefix+imgKey);
}