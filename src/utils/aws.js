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

export function uploadPhoto(files) {
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = String(new Date() / 1000)+file.name;

  var params = {
    Key: fileName,
    Body: file,
    ACL: 'public-read'
  }
  /*
  s3.upload({
    Key: fileName,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
    alert('Successfully uploaded photo.');
    // do magic here
  });
  */

  s3.upload(params, {timeout: 240000})
  .on('httpUploadProgress', function(evt) {
    console.log("Uploaded :: " + parseInt(((evt.loaded * 100) / evt.total), 10)+'%');
  }).send(function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
    alert("File uploaded successfully.");
  });
}