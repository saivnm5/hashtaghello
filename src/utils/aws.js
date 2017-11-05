import ImageCompressor from '@xkeshi/image-compressor';
import { toast } from 'react-toastify';
import { makeFilenameSafe } from './validate';

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

export function uploadPhoto(file, callbackObj) {
  var fileName = 'images/'+ String(new Date() / 1000) + makeFilenameSafe(file.name);
  var ignoreCompression = false;

  if(file.name.match(/.(gif)$/i)){
    ignoreCompression = true;
  }

  if(!ignoreCompression){
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
          var imgKey = data.key.substring(7); // removing the prefix "images/"
          var shotIndex = callbackObj.shotIndex;
          if(callbackObj.nextImageUpload){
            callbackObj.nextImageUpload(callbackObj.files, callbackObj.nextIndex, shotIndex, imgKey);
          }
          else{
            callbackObj.success(shotIndex, 'image', imgKey);
          }
        });

      },
      error(e) {
        console.log(e.message);
      },
    });
  }
  else{
    var params = {
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    };
    s3.upload(params)
    .on('httpUploadProgress', function(evt) {
      var percentage = parseInt(((evt.loaded * 100) / evt.total), 10);
      callbackObj.progress(percentage);
    }).send(function(err, data) {
      if (err) {
        toast.error("There was an error. Re-upload, or maybe upload a lighter file.");
        callbackObj.error();
      }
      var imgKey = data.key.substring(7); // removing the prefix "images/"
      var shotIndex = callbackObj.shotIndex;
      if(callbackObj.nextImageUpload){
        callbackObj.nextImageUpload(callbackObj.files, shotIndex, imgKey);
      }
      else{
        callbackObj.success(shotIndex, 'image', imgKey);
      }
    });
  }

}