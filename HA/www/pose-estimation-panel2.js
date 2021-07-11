import {
    LitElement,
    html,
    css,
  } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

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

class PosePanel extends LitElement {
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
    this.kpoints = this.hass.states.sensorpose_estimation.Attributes.Keypoints;
  }

  render() {
    return html`
     <div class="title">
        <p> ${JSON.stringify(this.hass.states.sensor, undefined, 2)}</p>
     </div>
     `;
  }
}

customElements.define('pose-estimation-panel', PosePanel);
