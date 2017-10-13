import React, { Component } from 'react';
import Event from '../stories/Story';
import axios from 'axios';

class List extends Component {

    constructor(props){
        super(props)

        this.state = {
            events: []
        }
    }

    componentWillMount(){
        var comp = this;
        var apiRoot = localStorage.getItem('apiRoot');
        axios({
          method: 'get',
          url: apiRoot+'/api/events/list'
        }).then(function(response){
            comp.setState({
                events: response.data
            })
        });
    }

    render() {
        var rows = [];
        var events = this.state.events;
        for (var i=0; i < events.length; i++) {
            if(events[i].isArchived === undefined){
                rows.push(<Story data={events[i]} key={i} />);
            }
        }

        return (
            <div className="list">
                <div className="list-header">
                    <div className="font-x-large">Events in #India </div>
                </div>
                <div className="list-body">
                    {rows}
                </div>
            </div>
        );
    }
}

export default List;