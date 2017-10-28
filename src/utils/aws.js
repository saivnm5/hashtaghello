import ImageCompressor from '@xkeshi/image-compressor';
import { toast } from 'react-toastify';

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
  var fileName = 'images/'+ String(new Date() / 1000) +file.name;
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
          callbackObj.success(shotIndex, 'image', imgKey);
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
      callbackObj.success(shotIndex, 'image', imgKey);
    });
  }

}

export function getImgUrl(imgKey, size) {
  var imgArray = [];
  var urlPrefix = 'https://hello-source.s3.ap-south-1.amazonaws.com/images/';
  var resizedUrlPrefix = 'https://hello-sourceresized.s3.ap-south-1.amazonaws.com/images/';

  if(size === 'all'){
    imgArray.push(resizedUrlPrefix+'full-'+imgKey);
    imgArray.push(urlPrefix+imgKey);
    return(imgArray);
  }
  else if(size === 'thumb-all'){
    imgArray.push(resizedUrlPrefix+'thumb-'+imgKey);
    imgArray.push(urlPrefix+imgKey);
    return(imgArray);
  }
  else if(size === 'full'){
    return (resizedUrlPrefix+'full-'+imgKey);
  }
  else{
    return (urlPrefix+imgKey);
  }
}

export function imageExists(imgUrl){
    var http = new XMLHttpRequest();
    http.open('HEAD', imgUrl, false);
    http.send();
    return http.status !== 404;
}