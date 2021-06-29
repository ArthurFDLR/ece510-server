import {html, css, LitElement} from 'lit';

var size_pose = 60;

function vh(v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

function vw(v) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}

function vmin(v) {
  return Math.min(vh(v), vw(v));
}

function vmax(v) {
  return Math.max(vh(v), vw(v));
}

function calculate_hypotenuse(p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) *  (p1[0] - p2[0]) + (p1[1] - p2[1]) *  (p1[1] - p2[1]));
}

function calculate_angle(p1, p2) { 
  if (p2[0] > p1[0] && p2[1] > p1[1]) {
    return - (180 / Math.PI) * Math.atan((p2[1] - p1[1]) / (p2[0] - p1[0]));
  }
  if (p2[0] < p1[0] && p2[1] > p1[1]) {
    return - 180 + (180 / Math.PI) * Math.atan((p2[1] - p1[1]) / (p1[0] - p2[0]));
  }
  if (p2[0] < p1[0] && p2[1] < p1[1]) {
    return 180 - (180 / Math.PI) * Math.atan((p1[1] - p2[1]) / (p1[0] - p2[0]));
  }
  if (p2[0] > p1[0] && p2[1] < p1[1]) {
    return (180 / Math.PI) * Math.atan((p1[1] - p2[1]) / (p2[0] - p1[0]));
  }
}

class SimpleGreeting extends LitElement {
  _handleResize = () => {this.size = vmin(size_pose)}
  static get styles() {
    return css`
 /* The parent element */
.css-chart {
  /* The chart borders */
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-top: 1px solid;
  border-right: 1px solid;
  /* The height, which is initially defined in the HTML */
  height:60vmin;
  /* A little breathing room should there be others items around the chart */
  margin: 1em;
  /* Remove any padding so we have as much space to work with inside the element */
  padding: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  /* The chart width, as defined in the HTML */
  width:60vmin;
}
/* The unordered list holding the data points, no list styling and no spacing */
.line-chart {
  list-style: none;
  margin: 0;
  padding: 0;
}
div.title {
  text-align: center;
  font-size: 10vmin;
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  left: 50vw;
}
        
/* Each point on the chart, each a 12px circle with a light border */
.data-point {
  background-color: red;
  border-radius: 50%;
  height: 12px;
  position: absolute;
  width: 12px;
  bottom: var(--y);
  left: var(--x);
  z-index: 9;
}
        
 .line-segment1 {
  background-color: blue;
  bottom: calc(var(--y) + 4.5px) ;
  height: 3px;
  left: calc(var(--x) + 4.5px);
  position: absolute;
  width: calc(var(--hypotenuse) * 1px);
  transform: rotate(calc(var(--angle) * 1deg));
  transform-origin: left bottom;
}
.line-segment2 {
  background-color: blue;
  bottom: calc(var(--y) + 7.5px) ;
  height: 3px;
  left: calc(var(--x) + 7.5px);
  position: absolute;
  width: calc(var(--hypotenuse) * 1px);
  transform: rotate(calc(var(--angle) * 1deg));
  transform-origin: left bottom;
}
        `;

  }

  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      size: {type: Object}, 
      kpoints : {type: Object}
    }
  }

  constructor() {
    super();
    this.size = vmin(size_pose);
    window.addEventListener('resize', this._handleResize);
    this.kpoints = this.hass.states.sensor.pose_estimation.Attributes.Keypoints;
  }

  render() {
    return html`
     <div class="title">
        <p> ${this.hass.states.sensor.pose_estimation.PoseLabel} </p>
     </div>
     <figure class="css-chart">
  <ul class="line-chart">
        <li style="--y: ${this.kpoints[1][1]*(this.size-6)}px; --x: ${this.kpoints[1][0]*(this.size-6)}px">
           <div class="data-point" data-value="1"></div>
           <div class="line-segment${calculate_angle(this.kpoints[1],this.kpoints[3]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[1],this.kpoints[3]) * this.size}; --angle: ${calculate_angle(this.kpoints[1],this.kpoints[3])};"></div>
        </li>
        <li style="--y: ${this.kpoints[16][1]*(this.size-6)}px; --x: ${this.kpoints[16][0]*(this.size-6)}px">
           <div class="data-point" data-value="16"></div>
           <div class="line-segment${calculate_angle(this.kpoints[16],this.kpoints[14]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[16],this.kpoints[14]) * this.size}; --angle: ${calculate_angle(this.kpoints[16],this.kpoints[14])};"></div>
        </li>
        <li style="--y: ${this.kpoints[14][1]*(this.size-6)}px; --x: ${this.kpoints[14][0]*(this.size-6)}px">
           <div class="data-point" data-value="14"></div>
           <div class="line-segment${calculate_angle(this.kpoints[14],this.kpoints[12]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[14],this.kpoints[12]) * this.size}; --angle: ${calculate_angle(this.kpoints[14],this.kpoints[12])};"></div>
        </li>
        <li style="--y: ${this.kpoints[12][1]*(this.size-6)}px; --x: ${this.kpoints[12][0]*(this.size-6)}px">
           <div class="data-point" data-value="12"></div>
           <div class="line-segment${calculate_angle(this.kpoints[12],this.kpoints[11]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[12],this.kpoints[11]) * this.size}; --angle: ${calculate_angle(this.kpoints[12],this.kpoints[11])};"></div>
        </li>
        <li style="--y: ${this.kpoints[11][1]*(this.size-6)}px; --x: ${this.kpoints[11][0]*(this.size-6)}px">
           <div class="data-point" data-value="11"></div>
           <div class="line-segment${calculate_angle(this.kpoints[11],this.kpoints[13]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[11],this.kpoints[13]) * this.size}; --angle: ${calculate_angle(this.kpoints[11],this.kpoints[13])};"></div>
        </li>
        <li style="--y: ${this.kpoints[13][1]*(this.size-6)}px; --x: ${this.kpoints[13][0]*(this.size-6)}px">
           <div class="data-point" data-value="13"></div>
           <div class="line-segment${calculate_angle(this.kpoints[13],this.kpoints[15]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[13],this.kpoints[15]) * this.size}; --angle: ${calculate_angle(this.kpoints[13],this.kpoints[15])};"></div>
        </li>
        <li style="--y: ${this.kpoints[10][1]*(this.size-6)}px; --x: ${this.kpoints[10][0]*(this.size-6)}px">
           <div class="data-point" data-value="10"></div>
           <div class="line-segment${calculate_angle(this.kpoints[10],this.kpoints[8]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[10],this.kpoints[8]) * this.size}; --angle: ${calculate_angle(this.kpoints[10],this.kpoints[8])};"></div>
        </li>
        <li style="--y: ${this.kpoints[8][1]*(this.size-6)}px; --x: ${this.kpoints[8][0]*(this.size-6)}px">
           <div class="data-point" data-value="8"></div>
           <div class="line-segment${calculate_angle(this.kpoints[8],this.kpoints[6]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[8],this.kpoints[6]) * this.size}; --angle: ${calculate_angle(this.kpoints[8],this.kpoints[6])};"></div>
        </li>
        <li style="--y: ${this.kpoints[6][1]*(this.size-6)}px; --x: ${this.kpoints[6][0]*(this.size-6)}px">
           <div class="data-point" data-value="6"></div>
           <div class="line-segment${calculate_angle(this.kpoints[6],this.kpoints[12]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[6],this.kpoints[12]) * this.size}; --angle: ${calculate_angle(this.kpoints[6],this.kpoints[12])};"></div>
           <div class="line-segment${calculate_angle(this.kpoints[6],this.kpoints[5]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[6],this.kpoints[5]) * this.size}; --angle: ${calculate_angle(this.kpoints[6],this.kpoints[5])};"></div>
        </li>
        <li style="--y: ${this.kpoints[5][1]*(this.size-6)}px; --x: ${this.kpoints[5][0]*(this.size-6)}px">
           <div class="data-point" data-value="5"></div>
           <div class="line-segment${calculate_angle(this.kpoints[5],this.kpoints[11]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[5],this.kpoints[11]) * this.size}; --angle: ${calculate_angle(this.kpoints[5],this.kpoints[11])};"></div>
           <div class="line-segment${calculate_angle(this.kpoints[5],this.kpoints[7]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[5],this.kpoints[7]) * this.size}; --angle: ${calculate_angle(this.kpoints[5],this.kpoints[7])};"></div>
        </li>
        <li style="--y: ${this.kpoints[7][1]*(this.size-6)}px; --x: ${this.kpoints[7][0]*(this.size-6)}px">
           <div class="data-point" data-value="7"></div>
           <div class="line-segment${calculate_angle(this.kpoints[7],this.kpoints[9]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[7],this.kpoints[9]) * this.size}; --angle: ${calculate_angle(this.kpoints[7],this.kpoints[9])};"></div>
        </li>
        <li style="--y: ${this.kpoints[0][1]*(this.size-6)}px; --x: ${this.kpoints[0][0]*(this.size-6)}px">
           <div class="data-point" data-value="0"></div>
           <div class="line-segment${calculate_angle(this.kpoints[0],this.kpoints[2]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[0],this.kpoints[2]) * this.size}; --angle: ${calculate_angle(this.kpoints[0],this.kpoints[2])};"></div>
           <div class="line-segment${calculate_angle(this.kpoints[0],this.kpoints[1]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[0],this.kpoints[1]) * this.size}; --angle: ${calculate_angle(this.kpoints[0],this.kpoints[1])};"></div>
           <div class="line-segment${calculate_angle(this.kpoints[0],this.kpoints[17]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[0],this.kpoints[17]) * this.size}; --angle: ${calculate_angle(this.kpoints[0],this.kpoints[17])};"></div>
        </li>
        <li style="--y: ${this.kpoints[2][1]*(this.size-6)}px; --x: ${this.kpoints[2][0]*(this.size-6)}px">
           <div class="data-point" data-value="2"></div>
           <div class="line-segment${calculate_angle(this.kpoints[2],this.kpoints[4]) > 0 ? 1 : 2}" style="--hypotenuse: ${calculate_hypotenuse(this.kpoints[2],this.kpoints[4]) * this.size}; --angle: ${calculate_angle(this.kpoints[2],this.kpoints[4])};"></div>
        </li>
        <li style="--y: ${this.kpoints[17][1]*(this.size-6)}px; --x: ${this.kpoints[17][0]*(this.size-6)}px">
           <div class="data-point" data-value="17"></div>
        </li>
        <li style="--y: ${this.kpoints[3][1]*(this.size-6)}px; --x: ${this.kpoints[3][0]*(this.size-6)}px">
           <div class="data-point" data-value="3"></div>
        </li>
        <li style="--y: ${this.kpoints[4][1]*(this.size-6)}px; --x: ${this.kpoints[4][0]*(this.size-6)}px">
           <div class="data-point" data-value="4"></div>
        </li>
        <li style="--y: ${this.kpoints[9][1]*(this.size-6)}px; --x: ${this.kpoints[9][0]*(this.size-6)}px">
           <div class="data-point" data-value="9"></div>
        </li>
        <li style="--y: ${this.kpoints[15][1]*(this.size-6)}px; --x: ${this.kpoints[15][0]*(this.size-6)}px">
           <div class="data-point" data-value="15"></div>
        </li>
        </ul>
  
</figure>`;
  }
}

customElements.define('simple-greeting', SimpleGreeting);
