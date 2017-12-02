import axios from 'axios';

export function getOembedData(url){
	var apiRoot = localStorage.getItem('apiRoot');
  var data = {
      query: "query ($url: String!) { \n oembed(url: $url) { \n html \n thumbnail_url \n } \n }",
      variables: {
        url: url
      }
  };
  return axios({
    method: 'post',
    url: apiRoot+'/get',
    data: data
  });
}