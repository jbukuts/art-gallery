import React from 'react';
import './App.css';
import './InDepth.css';
import $ from 'jquery';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Draggable from 'react-draggable';

class GoodLook extends React.Component {
  
    // on mount fade the components in
    componentDidMount() {
      $("#backdrop").fadeTo('250ms', 1);
      $(".in-depth").fadeTo('250ms', 1);
      $(".info").fadeTo('250ms', 1);
    }

    handleDrag(tag) {
      const isInfo = tag === '.in-depth' ? false : true;
      const front = isInfo ? $('.info') : $('.in-depth');
      const back = !isInfo ? $('.info') : $('.in-depth');

      back.css('z-index', 100);
      front.css('z-index', 101);
    }
  
    // show the detailed view
    render() {
  
      // stuff to display
      let fileName = `${this.props.focusImage.title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      let d = new Date();
      let months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemver', 'December'];
      let timeString = d.getHours() > 12 ? `${d.getHours()-12}:${d.getMinutes()} PM` : `${d.getHours()}:${d.getMinutes()} AM`;
      let dateString = `Modified: ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${timeString}`;
  
      // triangle icon
      let triangle = (r) => {return (<svg height="10" width="10" viewBox="0 0 10 10">
        <polygon points=".2 .2,9.8 .2,4.8 9.8" className={"triangle-icon"} transform={`rotate(${r ? 270 : 0},5,5)`}/>
      </svg>)};
  
      // seperator between sections
      let sep = <hr style={{paddingRight: '-3px', paddingLeft: '-3px', color: '#9f9f9f'}}></hr>;
  
      // creates the header
      let header = (r, title) => <span>
        <span>{triangle(r)}</span>
        <span style={{display: 'inline-block', verticalAlign: 'middle'}}>&nbsp;&nbsp;{title}:</span>
      </span>
  
      // image data
      const imageData = this.props.focusImage;
  
      // sections to creates
      let sections = [
        {
          name : "General", 
          properties: [["Name",imageData.title],["Creator", imageData.artist],["Date", imageData.date]]
        },
        {
          name : "More Info", 
          properties: [["Medium",imageData.classification],["Dimensions", imageData.dimensions]]
        },
        {
          name : "Name & Extension"
        },
        {
          name : "Comments", 
          properties: [["",imageData.comments]]
        },
        {
          name : "Open with"
        },
        {
          name : "Preview"
        },
        {
          name : "Sharing & Permissions"
        }
      ]
  
      // add properties to section as needed
      let addProperties = (properties) => {
        return properties.map(x => {
          const pStyle = {marginBottom: '2px', marginTop: '2px', marginLeft: "30px"};
          const innerProp = `${(x[0].length > 0) ? `${x[0]}: ` : ''}  ${x[1]}`;
          return ( x[1] &&
            <p style={pStyle} dangerouslySetInnerHTML={{__html: innerProp}}></p>
          )
        });
      }
  
      // create the sections from the array
      let createSections = (sections) => {
        return sections.map(x => {

          const areThere = x.properties ? x.properties.reduce((acc, cur) => { return acc ? acc : (cur[1] ? true : false)}, false) : false;

          return ( 
            <div>
              {sep}
              {header(!areThere, x.name)}
              {areThere && addProperties(x.properties)}
            </div>
          )
        });
      }

      const bannerStyling = {
        height: '25px', 
        width: '100%', 
        textAlign: 'center', 
        fontSize: '10px', 
        backgroundImage: 'url(https://static.tumblr.com/ly7no2u/N3Mogrkha/header-preview.png)', 
        backgroundPosition: 'top center', 
        backgroundRepeat: 'repeat-x',
        borderRadius: '4px 4px 0px 0px',
        position: 'relative'
      };

      return (
        <div>
          {/* This will blur the background */}
          <div id="backdrop" onClick={this.props.handleRemove}></div>

          {/* The actual full view of the image */}
          <Draggable cancel=".react-transform-component" onStart={() => this.handleDrag('.in-depth')} bounds="body">
            <div className={"in-depth"}>     
              <div style={bannerStyling}>
                <p style={{paddingTop: '8px', margin: 'auto', textOverflow: 'ellipsis', width: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'center'}}>{fileName}</p>
  
                <div style={{position: 'relative', display: 'flex', marginTop: '-16px'}}>
                  <div className={'top-button'} style={{backgroundColor: '#FC5753', marginLeft: '5px', border: '1px solid #E03e3b'}}></div>
                  <div className={'top-button'} style={{backgroundColor: '#FDBC40', border: '1px solid #dd9b23'}}></div>
                  <div className={'top-button'} style={{backgroundColor: '#33C748', border: '1px solid #24a733'}}></div>
                </div>
              </div>
  
              {/* allow for zoom on the image */}
              <TransformWrapper onPanningStart={() => this.handleDrag('.in-depth')}>
                <TransformComponent>
                  <div>
                    <img src={this.props.focusImage.file_name} alt="" style={{marginBottom: '-6px'}}/>
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>
          </Draggable>
  
          {/* the info window on the image */}
          <Draggable onStart={() => this.handleDrag('.info')} bounds="body">
            <div className={'info'} style={{borderCollapse: 'separate'}}>
              <div style={bannerStyling}>
                <div style={{marginTop: '0px', position: 'relative', top: '7px'}}>Image Info</div>
              </div>
            
              <div style={{paddingRight: '7px', paddingLeft: '7px', marginTop: '10px', fontSize: '11px', wordWrap: 'break-word'}}>
                {/* header of the window*/}
                <p style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '5px'}}>{fileName}</p>
                <p style={{marginTop: '0px'}}>{dateString}</p>
                
                {createSections(sections)}
              </div>
            </div>
          </Draggable>
        </div> 
      )
    }
  }

  export default GoodLook;