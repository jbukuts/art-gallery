import React from 'react';
import './App.css';
import art from './art.json';
import $ from 'jquery';
import GoodLook from './GoodLook.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageList: null,
      imageFocus: null,
      showGoodLook: false,
      isLocal: true
    };

    // bind some handlers
    this.removeGoodLook = this.removeGoodLook.bind(this);
    this.downHandler = this.downHandler.bind(this)
    this.flipImages = this.flipImages.bind(this)
  }

  async componentDidMount() {
    // key listener
    await this.setState({
      imageList: await CreateImageCollage(this, this.state.isLocal)
    });

    window.addEventListener('keydown', this.downHandler);
  }

  // on pade unmount
  componentWillUnmount() {
    // remove key listener
    window.removeEventListener('keydown', this.downHandler);
  }
  
  // in order to show the good look
  async showGoodLook(e, wantedImage) {
    // simply change state
    // good look is conditional rendered
    console.log(wantedImage);
    await this.setState({ 
      imageFocus: wantedImage,
      showGoodLook: true
    });
  }

  // remove the good look
  async removeGoodLook() {
    // fade out and set state to false to unmount
    $(".in-depth").fadeTo('250ms', 0);
    $(".info").fadeTo('250ms', 0);
    $("#backdrop").fadeTo('250ms', 0, () => {
      this.setState({showGoodLook: false})
    });
  }

  // pull images from MET or local
  async flipImages(newState) {
    const photos = $('#photos');
    $('body').css('overflow', 'hidden').css('pointer-events', 'none');
    $('.swapButton').prop('disabled', true);

    await photos.fadeTo('1s', 0, async () => {
      const loading = $('#loading');
      loading.css('display', 'block');
      loading.fadeTo('.25s', 1);

      this.setState({
          imageList: await CreateImageCollage(this, newState),
          isLocal: newState
        }, 
        ()=> {
          loading.fadeTo('.25s', 0, () => {loading.css('display', 'none')});
          photos.fadeIn("slow").delay(800).fadeTo('1s', 1, () => {
            $('body').css('overflow', 'auto').css('pointer-events', 'all');
            $('.swapButton').prop('disabled', false);
          });
        }
      );
    });
  }

  // handle keypresses
  downHandler(e) {    
    // if null ignore
    if (this.state.imageFocus == null)
      return;

    // get current index of focued image
    let index = this.state.imageList.findIndex((i) => i[1].title === this.state.imageFocus.title);

    // figure out what key was pressed
    // ensure 
    let newIndex = -1;
    if (e.key === "ArrowRight")
      newIndex = (index + 1 > this.state.imageList.length-1) ? 0 : index +1;
    else if (e.key === "ArrowLeft")
      newIndex = (index - 1 < 0) ? this.state.imageList.length-1 : index-1;
    else
      return;
    
    // change state of current image based on keypress
    this.setState({
      imageFocus: this.state.imageList[newIndex][1]
    }) 
  }

  render() {
    return (
      <div style={{width: '80%', margin: 'auto', position: 'relative'}} >
        {/* if click on image show the detailed view */}
        {this.state.showGoodLook && <GoodLook focusImage={this.state.imageFocus} handleRemove={this.removeGoodLook}/>}
        
        {/* Just a simple header */}
        <span>
          {/**<img src={`${process.env.PUBLIC_URL}/assets/folder.png`} style={{float: 'left', width: '65px'}}/>**/}
          <h1 style={{fontSize: '40px', marginBottom: '5px', paddingTop: '10px'}}>The Gallery</h1>
        </span>
        
        <p style={{marginTop: '0px'}}>
          This is just a collection of art I like.<br/>
          Thought it'd be nice to see them all in one place.<br/>
          I do not own any of them of course.
        </p>

        {/* buttons to pull from MET */}
        <button className={'swapButton'} onClick={() => this.flipImages(!this.state.isLocal)}>{this.state.isLocal ? 'Random MET' : 'Back to Mine'}</button>
        {!this.state.isLocal && <button className={'swapButton'} onClick={() => this.flipImages(this.state.isLocal)}>Get different from MET</button>}

        <br/>
        <br/>

        {/* beach ball loading for the page */}
        <div id="loading">
          <div>
            <img src={`${process.env.PUBLIC_URL}/assets/spinning-ball.png`} alt=""/>
          </div>
          <h2>Loading Photos</h2>
        </div>
        

        {/* the actual image collage */}
        <div id="photos">
          {this.state.imageList && this.state.imageList.map(x => x[0])}
        </div>

        {/* footer of the page */}
        <div id="footer">
          { !this.state.isLocal && <div>
            <img style={{width: '100px' , height: '100px'}} src={`${process.env.PUBLIC_URL}/assets/MetLogo.svg`} alt="Thank you to the MET" height={'100'} width={'100'}/>
          </div>}

          <div>
            <p style={{marginBottom: '0px', fontSize: '14px', width: '100%'}}>Jake Bukuts 2021</p>
          </div>
        </div>
      </div>
    )
  }
}

// create the image collage
async function CreateImageCollage(thing, isLocal) {
  const imageList =  isLocal ? getLocalArtList() : await getRandomArtList();
  return imageList.map(
    (x,i) => {
      return [createSingleImage(x,i,thing), x]
    }
  );
}

// creates a single image to display in list
function createSingleImage(x,i, thing) {
  return (
    <div className={"work"} key={i}>
        <div className={"meta"}>
          <div className={"icon"}></div>
          <div className={"file-name"}>
            <a href={`https://www.google.com/search?q=${x.title} ${x.artist}`} target="_blank" rel="noreferrer">{x.title.replaceAll(' ', '_').toLowerCase()}.jpg</a>
          </div>
        </div>
        
        <div style={{display: 'flex'}}>
          <div className={"banner-left"}  style={{height: '55px', width: '180px'}}></div>
          <div className={"banner-mid"}   style={{height: '55px', width: 'calc(100% - 331px)'}}></div>
          <div className={"banner-right"} style={{height: '55px', width: '151px'}}></div>
        </div>
        <img src={x.file_name} alt="" onMouseEnter={showWorkInfo} onMouseLeave={removeWorkInfo} onClick={(e)=> thing.showGoodLook(e,x)}/>
    </div>
  )
}

function getLocalArtList() {
  // only one work per artist
  var clonedArray = JSON.parse(JSON.stringify(art))

  return shuffleArray(clonedArray).reduce((acc, current) => {
    const x = acc.find(item => item.artist === current.artist);
      return !x ? acc.concat([current]) : acc;
  }, []).map(x => {x.file_name = `${process.env.PUBLIC_URL}/assets/art/${x.file_name}`; return x});
}


// pull random image data from the MET 
async function getRandomArtList() {
  let url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting';
  
  return await fetch(url)
    .then(r => r.json())
    .then(async (r) => {
      const total = r.total;
      let works = [];

      for (let i = 0; i < 15; ++i) {
        let id = Math.floor(Math.random() * (total-1));
        await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${r.objectIDs[id]}`)
          .then(r => r.json())
          .then(r => {
            r['date'] = (r.artistDisplayName) !== '' ? r.objectDate : 'Unknown';
            r['file_name'] = r.primaryImage;
            r['artist'] = (r.artistDisplayName) !== '' ? r.artistDisplayName : 'Unknown';
            r['comments'] = (r.medium) !== '' ? r.medium : 'N/A';
            r['title'] = r.title.length > 50 ? `${r.title.substring(0,50)}` : r.title;
            works.push(r);
        });
      }

      return works;
    });
}

// grey out all except for one
function showWorkInfo(e) {
  let invert = [...document.querySelectorAll('.work')].filter(x => x !== e.target.parentNode);
  invert.forEach(x => {
    x.children[2].style.filter = 'grayscale(100%) blur(0px)';
  })
}

// reset the colors of all images
function removeWorkInfo(e) {
  let invert = [...document.querySelectorAll('.work')].filter(x => x !== e.target.parentNode);
  invert.forEach(x => {
    x.children[2].style.filter = 'grayscale(0%) blur(0px)';
  })
}

// helper to shuffle array
function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default App;
