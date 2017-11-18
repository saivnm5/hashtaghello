import React, { Component } from 'react';
import Story from '../stories/Story';
import axios from 'axios';
import coffeeImg from '../assets/img/coffee.png';
import { Link } from 'react-router-dom';
import './list.css';

class List extends Component {

    constructor(props){
        super(props)

        this.state = {
            stories: [],
            page: 0,
            endOfList: false
        }
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= (window.innerHeight+80);
    }

    componentDidUpdate() {
        if(!this.state.endOfList){
            document.addEventListener('scroll', this.trackScrolling);
        }
    }

    trackScrolling = () => {
      const wrappedElement = document.getElementById('root');
      if (this.isBottom(wrappedElement)) {
        document.removeEventListener('scroll', this.trackScrolling);
        this.loadContent(this.state.page+1);
      }
    };

    loadContent = (page) => {
        var comp = this;
        var apiRoot = localStorage.getItem('apiRoot');
        var data = {};
        var currentStories = this.state.stories;

        data = {
          query: "query ($type: String, $page: Int) { \n stories(type: $type, page: $page) { \n id \n hashtag \n description \n imgKey \n thumbnailUrl \n mediaUrl \n slug \n } \n }",
          variables: {
            page: page,
            type: this.props.type
          }
        };

        let headers = { "Authorization" : localStorage.getItem("authToken") };
        axios({
          method: 'post',
          url: apiRoot+'/public',
          data: data,
          headers: headers
        }).then(function(response){
            var data = response.data.data;
            if(!data.stories || data.stories.length === 0){
                comp.setState({
                    endOfList: true
                });
            }
            else{
                var newStories = currentStories.concat(data.stories);
                comp.setState({
                    stories: newStories,
                    page: page
                });
            }
        });
    }

    componentWillMount(){
        this.loadContent(0);
    }

    logout = () => {
        localStorage.removeItem('isLoggedIn');
        window.location = '/';
    }

    render() {
        var rows = [];
        var stories = this.state.stories;
        if(stories.length > 0){
            for (var i=0; i < stories.length; i++) {
                rows.push(<Story data={stories[i]} key={i} type={this.props.type} />);
            }
        }
        else if(this.props.type === "self"){
            rows = (
                <div className="lets-begin-story">
                    <div>
                        <img src={coffeeImg} alt="lets begin" />
                    </div>
                    <div className="font-sub-heading">
                        this is the place where your stories will come to live
                    </div>
                    <br/><br/>
                    <div className="font-heading btn">
                        <Link to="/create">
                            let's begin
                        </Link>
                    </div>
                </div>
            );
        }

        var featuredTabClass = '';
        var publicTabClass = '';
        var selfTabClass = '';
        var selectedTabClass = 'selected-tab';
        if(this.props.type === 'self'){
            selfTabClass = selectedTabClass;
        }
        else if(this.props.type === 'public'){
            publicTabClass = selectedTabClass;
        }
        else if(this.props.type === 'featured'){
            featuredTabClass = selectedTabClass;
        }


        var tabComp = (
            <span>
                <span className={"font-sub-heading soft-btn "+featuredTabClass}>
                    <Link to="/featured">
                        featured
                    </Link>
                </span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <span className={"font-sub-heading soft-btn "+publicTabClass}>
                    <Link to="/public">
                        public
                    </Link>
                </span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <span className={"font-sub-heading "+selfTabClass}>
                    <Link to="/profile">
                        your stories
                    </Link>
                </span>
                &nbsp;&nbsp;|&nbsp;&nbsp;

                <span className="font-sub-heading soft-btn" onClick={this.logout}>logout</span>
            </span>
        );

        return (
            <div className="list">
                <div className="list-header">
                    {tabComp}
                </div>
                <div className="list-body">
                    {rows}
                </div>
            </div>
        );
    }
}

export default List;