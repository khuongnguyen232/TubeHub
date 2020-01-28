import React from 'react';
import he from 'he';

import Comment from '../Comment/Comment';
import Spinner from '../Spinner';
import API from '../../api/youtube';

const convertTime = (time) => {
  const [date,hour] = time.replace('T','.').split('.');
  return date + ' ' + hour;
}

class VideoDetail extends React.Component {
  state = {video:null};

  loadVidStat = async () => {
    if(this.props.video) {
      try {
        const response = await API.get('./videos', {
          params: {
            part:'statistics',
            id:this.props.video.id.videoId
          }
        });
        this.setState({video:response.data.items[0]})
      }catch(err) {
        console.log(err);
      }
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.video !== prevProps.video) {
      this.loadVidStat();
    }
  }

  render() {
  if(!this.props.video) return <Spinner />

  const VideoSrc = `https://www.youtube.com/embed/${this.props.video.id.videoId}`;
    const title = he.decode(this.props.video.snippet.title);
    if(this.state.video) {
      const {likeCount,dislikeCount,viewCount} = this.state.video.statistics;
      const likePercent = parseInt(likeCount,10) / (parseInt(likeCount,10) + parseInt(dislikeCount,10)) * 100;
      const likePercentInt = Math.round(likePercent);
      //let likePercent = 20;
      return(
        <div>
          <div className = "ui embed">
            <iframe title = "video player" src ={VideoSrc} allowFullScreen/>
          </div>
          <div className = "ui segment">
            <h4 className = "ui header"> {title}</h4>
            <div className="stat-section">
              <div className="view-count">{viewCount} views</div>
              <div className="publish-time">{convertTime(this.props.video.snippet.publishedAt)}</div>
              <div className="ui success progress">
                <div className="bar" style={{width:`${likePercentInt}%`}}><div className="progress">{likePercentInt}% Likes</div></div>
              </div>
            </div>
            <div className = "info-text">{this.props.video.snippet.description}</div>
            <div className="stat-section">
          </div>
         </div>
          <Comment id={this.props.video.id.videoId}/>
        </div>
      );
    } else return <Spinner />
  }
};

export default VideoDetail;
