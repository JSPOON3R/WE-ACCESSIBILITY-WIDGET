// =============================
// content.js
// =============================

let currentState = null;
let widgetInjected = false;

const accessibilityMenuStyles = `
		:root {
	  --acc_color_1: #000;
	  --acc_color_2: #fff;
	  --border_radius: 25px;
	}
	
	.hidden {
	  display:none !important;
	}
	
	#accessibility-modal,
	#accessibility-modal * {
	  transition: opacity 0.5s ease;
	  font-family: 'Nunito', sans-serif;
	  font-size: 16px;
	  line-height: 1;
	  letter-spacing: 0;
	  text-align: center;
	  user-select: none;
	}
	
	#accessibility-modal {
	  position: fixed;
	  top: 5vh;
	  left: 0;
	  width: 98%;
	  max-width: 500px;
	  height: auto;
	  max-height: 90vh;
	  background: var(--acc_color_2);
	  z-index: 1000;
	  justify-content: center;
	  border-radius: 0 var(--border_radius) var(--border_radius) 0;
	  border: 1px solid var(--acc_color_1);
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	  overflow: clip;
	  display: flex;
	  flex-direction: column;
	}
	
	#accessibility-modal #closeBtn {
	  position: absolute;
	  width: 50px;
	  height: 50px;
	  border-radius: var(--border_radius);
	  background: var(--acc_color_1);
	  color: var(--acc_color_2);
	  cursor: pointer;
	  overflow: clip;
	  border: none;
	  outline: none;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  transform: translate(0,-4px);
	}
	
	#accessibility-modal.left #closeBtn {
	  top: 0;
	  right: 0;
	  margin: 15px;
	}
	
	#accessibility-modal.right #closeBtn {
	  top: 0;
	  left: 0;
	  margin: 15px;
	}
	
	#accessibility-modal.top #closeBtn {
	  top: 0;
	  left: 0;
	  margin: 15px;
	}
	
	#accessibility-modal.bottom #closeBtn {
	  top: 0;
	  left: 0;
	  margin: 15px;
	}
	
	#accessibility-modal.left {
	  left: 0;
	  right: auto;
	  border-radius: 0 var(--border_radius) var(--border_radius) 0;
	}
	
	#accessibility-modal.right {
	  right: 0;
	  left: auto;
	  border-radius: var(--border_radius) 0 0 var(--border_radius);
	}
	
	#accessibility-modal.top {
	  top: 0;
	  left: 1%;
	  height: auto;
	  max-height: 90vh;
	  border-radius: 0 0 var(--border_radius) var(--border_radius);
	}
	
	#accessibility-modal.bottom {
	  top: auto;
	  bottom: 0;
	  left: 1%;
	  height: auto;
	  max-height: 90vh;
	  border-radius: var(--border_radius) var(--border_radius) 0 0;
	}
	
	#accessibility-modal.close {
	  width: 50px;
	  height: 50px;
	  border-radius: var(--border_radius);
	  cursor: pointer;
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	  overflow: clip;
	  margin: 5px;
	  padding: 0;
	}
	
	#accessibility-modal.close .acc-item {
	  opacity: 0;
	}
	
	#accessibility-modal.close #closeBtn {
	  position: absolute;
	  width: 50px;
	  height: 50px;
	  border: none;
	  background: none;
	  color: var(--acc_color_2);
	  background: var(--acc_color_1);
	  font-size: 20px;
	  cursor: pointer;
	  margin: 0;
	  transform: translate(0,0);
	}
	
	#accessibility-modal #closeBtn svg {
	  width: 20px;
	  height: 20px;
	}
	
	#accessibility-modal.close #closeBtn svg {
	  width: 40px;
	  height: 40px;
	}
	
	#accessibility-modal.close:hover #closeBtn {
	  filter: opacity(1);
	}
	
	#accessibility-modal #headerContent {
	  position: relative;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  width: calc(100% - 80px);
	  height: 50px;
	  background: var(--acc_color_1);
	  color: var(--acc_color_2);
	  border-radius: var(--border_radius);
	  margin: 10px 10px 10px 70px;
	}
	
	#accessibility-modal.left #headerContent {
	  margin: 10px 70px 10px 10px;
	}
	
	#accessibility-modal.right #headerContent {
	  margin: 10px 10px 10px 70px;
	}
	
	#accessibility-modal #headerContent p {
	  font-size: 20px;
	  font-weight: 600;
	}
	
	#accessibility-modal.close #headerContent {
	  display: none;
	}
	
	#accessibility-tools {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: center;
	  align-items: start;
	  width: 100%;
	  height: auto;
	  transition: opacity 0.5s ease;
	  overflow-y: auto;
	  margin-bottom: 140px;
	}
	
	#accessibility-tools::-webkit-scrollbar {
	  width: 10px;
	  background: var(--acc_color_2);
	}
	
	#accessibility-tools::-webkit-scrollbar-thumb {
	  background: var(--acc_color_1);
	  border-radius: 10px;
	}
	
	.acc-item {
	  min-width: 120px;
	  width: 33%;
	  max-width: 200px;
	  height: auto;
	  margin: 0;
	  cursor: pointer;
	}
	
	.acc-item:hover .acc-child {
	  box-shadow: 0 0 5px rgba(0, 0, 0, .5);
	}
	
	.acc-item:hover .acc-child.active {
	  filter: opacity(0.8);
	  border: 1px solid var(--acc_color_2);
	  color: var(--acc_color_2);
	}
	
	.acc-child {
	  position: relative;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  width: auto;
	  height: auto;
	  aspect-ratio: 1/1;
	  background: var(--acc_color_2);
	  border-radius: var(--border_radius);
	  margin: 10px;
	  padding: 10px 10px 0;
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	  border: 1px solid var(--acc_color_1);
	  color: var(--acc_color_1);
	}
	
	.acc-child.active {
	  background: var(--acc_color_1);
	  color: var(--acc_color_2);
	  box-shadow: none;
	  border: 1px solid var(--acc_color_1);
	}
	
	.acc-progress-parent {
	  display: flex;
	  justify-content: space-between;
	  width: 100%;
	  padding-bottom: 10px;
	}
	
	.acc-progress-child {
	  min-width: 30%;
	  width: 48%;
	  max-width: 48%;
	  height: 3px;
	  margin: 0 1%;
	  background: var(--acc_color_1);
	  border-radius: 5px;
	}
	
	.acc-child.active .acc-progress-child {
	  background: var(--acc_color_2);
	  opacity: 0.5;
	}
	
	.acc-child.active .acc-progress-child.active {
	  opacity: 1;
	}
	
	#accessibility-tools svg,
	#accessibility-tools img {
	  width: 30px;
	  height: 30px;
	  margin-bottom: 10px;
	}
	
	#change-positions {
	  display: flex;
	  align-items: bottom;
	  width: fit-content;
	  background: var(--acc_color_1);
	  border-top-right-radius: var(--border_radius);
	}
	
	#change-positions button {
	  width: auto;
	  height: 50px;
	  border: none;
	  background: var(--acc_color_1);
	  color: var(--acc_color_2);
	  cursor: pointer;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  aspect-ratio: 1/1;
	  padding: 20px;
	  margin: 10px;
	  border-radius: var(--border_radius);
	}
	
	#change-positions button svg {
	  scale: 1.3;
	  fill: var(--acc_color_2);
	}
	
	#change-positions button:hover {
	  background: var(--acc_color_2);
	}
	
	#change-positions button:hover svg {
	  scale: 1.8;
	  fill: var(--acc_color_1);
	}
	
	#change-positions button.active {
	  background: var(--acc_color_2);
	}
	
	#change-positions button.active svg {
	  fill: var(--acc_color_1);
	}
	
	#acc-footer {
	  display: flex;
	  flex-direction: column;
	  width: 100%;
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  background: var(--acc_color_2);
	}
	
	#reset-all {
	  width: calc(100% - 20px);
	  height: 50px;
	  background: var(--acc_color_1);
	  color: var(--acc_color_2);
	  border-radius: var(--border_radius);
	  cursor: pointer;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  margin: 10px;
	}
	
	#reset-all:hover {
	  filter: opacity(0.8);
	}
	
	/*Accessibility Tools*/
	
	.invert {
	  filter: invert(1);
	}
	
	.grayscale {
	  filter: grayscale(1);
	}
	
	.low-saturation {
	  filter: saturate(20%);
	}
	
	.high-saturation {
	  filter: saturate(200%);
	}
	
	.underline-style-0 a {
	  text-decoration: none;
	  background: black !important;
	  color: yellow !important;
	  font-weight: bolder;
	}
	
	.underline-style-0 a:hover,
	.underline-style-2 a:hover,
	.underline-style-1 a:hover {
	  text-decoration: underline !important;
	}
	
	.underline-style-1 a {
	  text-decoration: none;
	  background: #FFD740 !important;
	  color: #005A9C !important;
	  font-weight: bolder;
	}
	
	.underline-style-2 a {
	  text-decoration: none;
	  background: white !important;
	  color: black !important;
	  font-weight: bolder;
	}
	
	.contrast-style-0 {
	  filter: contrast(0.5);
	}
	
	.contrast-style-1 {
	  filter: contrast(1.5);
	}
	
	.contrast-style-2 {
	  filter: contrast(2);
	}
	
	/*Apply Two or more filters*/
	
	.invert.grayscale {
	  filter: invert(1) grayscale(1);
	}
	
	.invert.low-saturation {
	  filter: invert(1) saturate(20%);
	}
	
	.invert.high-saturation {
	  filter: invert(1) saturate(200%);
	}
	
	.invert.contrast-style-0 {
	  filter: invert(1) contrast(0.5);
	}
	
	.invert.contrast-style-1 {
	  filter: invert(1) contrast(1.5);
	}
	
	.invert.contrast-style-2 {
	  filter: invert(1) contrast(2);
	}
	
	.grayscale.low-saturation {
	  filter: grayscale(1) saturate(20%);
	}
	
	.grayscale.high-saturation {
	  filter: grayscale(1) saturate(200%);
	}
	
	.grayscale.contrast-style-0 {
	  filter: grayscale(1) contrast(0.5);
	}
	
	.grayscale.contrast-style-1 {
	  filter: grayscale(1) contrast(1.5);
	}
	
	.grayscale.contrast-style-2 {
	  filter: grayscale(1) contrast(2);
	}
	
	.low-saturation.high-saturation {
	  filter: saturate(20%) saturate(200%);
	}
	
	.low-saturation.contrast-style-0 {
	  filter: saturate(20%) contrast(0.5);
	}
	
	.low-saturation.contrast-style-1 {
	  filter: saturate(20%) contrast(1.5);
	}
	
	.low-saturation.contrast-style-2 {
	  filter: saturate(20%) contrast(2);
	}
	
	.high-saturation.contrast-style-0 {
	  filter: saturate(200%) contrast(0.5);
	}
	
	.high-saturation.contrast-style-1 {
	  filter: saturate(200%) contrast(1.5);
	}
	
	.high-saturation.contrast-style-2 {
	  filter: saturate(200%) contrast(2);
	}
	
	.contrast-style-0.contrast-style-1 {
	  filter: contrast(0.5) contrast(1.5);
	}
	
	.contrast-style-0.contrast-style-2 {
	  filter: contrast(0.5) contrast(2);
	}
	
	.contrast-style-1.contrast-style-2 {
	  filter: contrast(1.5) contrast(2);
	}
	
	.invert.grayscale.low-saturation {
	  filter: invert(1) grayscale(1) saturate(20%);
	}
	
	.invert.grayscale.high-saturation {
	  filter: invert(1) grayscale(1) saturate(200%);
	}
	
	.invert.grayscale.contrast-style-0 {
	  filter: invert(1) grayscale(1) contrast(0.5);
	}
	
	.invert.grayscale.contrast-style-1 {
	  filter: invert(1) grayscale(1) contrast(1.5);
	}
	
	.invert.grayscale.contrast-style-2 {
	  filter: invert(1) grayscale(1) contrast(2);
	}
	
	.invert.low-saturation.high-saturation {
	  filter: invert(1) saturate(20%) saturate(200%);
	}
	
	.invert.low-saturation.contrast-style-0 {
	  filter: invert(1) saturate(20%) contrast(0.5);
	}
	
	.invert.low-saturation.contrast-style-1 {
	  filter: invert(1) saturate(20%) contrast(1.5);
	}
	
	.invert.low-saturation.contrast-style-2 {
	  filter: invert(1) saturate(20%) contrast(2);
	}
	
	.invert.high-saturation.contrast-style-0 {
	  filter: invert(1) saturate(200%) contrast(0.5);
	}
	
	.invert.high-saturation.contrast-style-1 {
	  filter: invert(1) saturate(200%) contrast(1.5);
	}
	
	.invert.high-saturation.contrast-style-2 {
	  filter: invert(1) saturate(200%) contrast(2);
	}
	
	.invert.contrast-style-0.contrast-style-1 {
	  filter: invert(1) contrast(0.5) contrast(1.5);
	}
	
	.invert.contrast-style-0.contrast-style-2 {
	  filter: invert(1) contrast(0.5) contrast(2);
	}
	
	.invert.contrast-style-1.contrast-style-2 {
	  filter: invert(1) contrast(1.5) contrast(2);
	}
	
	.grayscale.low-saturation.high-saturation {
	  filter: grayscale(1) saturate(20%) saturate(200%);
	}
	
	.grayscale.low-saturation.contrast-style-0 {
	  filter: grayscale(1) saturate(20%) contrast(0.5);
	}
	
	.grayscale.low-saturation.contrast-style-1 {
	  filter: grayscale(1) saturate(20%) contrast(1.5);
	}
	
	.grayscale.low-saturation.contrast-style-2 {
	  filter: grayscale(1) saturate(20%) contrast(2);
	}
	
	.grayscale.high-saturation.contrast-style-0 {
	  filter: grayscale(1) saturate(200%) contrast(0.5);
	}
	
	.grayscale.high-saturation.contrast-style-1 {
	  filter: grayscale(1) saturate(200%) contrast(1.5);
	}
	
	.grayscale.high-saturation.contrast-style-2 {
	  filter: grayscale(1) saturate(200%) contrast(2);
	}
	
	.grayscale.contrast-style-0.contrast-style-1 {
	  filter: grayscale(1) contrast(0.5) contrast(1.5);
	}
	
	.grayscale.contrast-style-0.contrast-style-2 {
	  filter: grayscale(1) contrast(0.5) contrast(2);
	}
	
	.grayscale.contrast-style-1.contrast-style-2 {
	  filter: grayscale(1) contrast(1.5) contrast(2);
	}
	
	.low-saturation.high-saturation.contrast-style-0 {
	  filter: saturate(20%) saturate(200%) contrast(0.5);
	}
	
	.low-saturation.high-saturation.contrast-style-1 {
	  filter: saturate(20%) saturate(200%) contrast(1.5);
	}
	
	.low-saturation.high-saturation.contrast-style-2 {
	  filter: saturate(20%) saturate(200%) contrast(2);
	}
	
	.low-saturation.contrast-style-0.contrast-style-1 {
	  filter: saturate(20%) contrast(0.5) contrast(1.5);
	}
	
	.low-saturation.contrast-style-0.contrast-style-2 {
	  filter: saturate(20%) contrast(0.5) contrast(2);
	}
	
	.low-saturation.contrast-style-1.contrast-style-2 {
	  filter: saturate(20%) contrast(1.5) contrast(2);
	}
	
	.high-saturation.contrast-style-0.contrast-style-1 {
	  filter: saturate(200%) contrast(0.5) contrast(1.5);
	}
	
	.high-saturation.contrast-style-0.contrast-style-2 {
	  filter: saturate(200%) contrast(0.5) contrast(2);
	}
	
	.high-saturation.contrast-style-1.contrast-style-2 {
	  filter: saturate(200%) contrast(1.5) contrast(2);
	}
	
	.contrast-style-0.contrast-style-1.contrast-style-2 {
	  filter: contrast(0.5) contrast(1.5) contrast(2);
	}
	
	.invert.grayscale.low-saturation.high-saturation {
	  filter: invert(1) grayscale(1) saturate(20%) saturate(200%);
	}
	
	.invert.grayscale.low-saturation.contrast-style-0 {
	  filter: invert(1) grayscale(1) saturate(20%) contrast(0.5);
	}
	
	.invert.grayscale.low-saturation.contrast-style-1 {
	  filter: invert(1) grayscale(1) saturate(20%) contrast(1.5);
	}
	
	.invert.grayscale.low-saturation.contrast-style-2 {
	  filter: invert(1) grayscale(1) saturate(20%) contrast(2);
	}
	
	.invert.grayscale.high-saturation.contrast-style-0 {
	  filter: invert(1) grayscale(1) saturate(200%) contrast(0.5);
	}
	
	.invert.grayscale.high-saturation.contrast-style-1 {
	  filter: invert(1) grayscale(1) saturate(200%) contrast(1.5);
	}
	
	.invert.grayscale.high-saturation.contrast-style-2 {
	  filter: invert(1) grayscale(1) saturate(200%) contrast(2);
	}
	
	.invert.low-saturation.high-saturation.contrast-style-0 {
	  filter: invert(1) saturate(20%) saturate(200%) contrast(0.5);
	}
	
	.invert.low-saturation.high-saturation.contrast-style-1 {
	  filter: invert(1) saturate(20%) saturate(200%) contrast(1.5);
	}
	
	.invert.low-saturation.high-saturation.contrast-style-2 {
	  filter: invert(1) saturate(20%) saturate(200%) contrast(2);
	}
	
	.invert.low-saturation.contrast-style-0.contrast-style-1 {
	  filter: invert(1) saturate(20%) contrast(0.5) contrast(1.5);
	}
	
	.invert.low-saturation.contrast-style-0.contrast-style-2 {
	  filter: invert(1) saturate(20%) contrast(0.5) contrast(2);
	}
	
	.invert.low-saturation.contrast-style-1.contrast-style-2 {
	  filter: invert(1) saturate(20%) contrast(1.5) contrast(2);
	}
	
	.invert.high-saturation.contrast-style-0.contrast-style-1 {
	  filter: invert(1) saturate(200%) contrast(0.5) contrast(1.5);
	}
	
	.invert.high-saturation.contrast-style-0.contrast-style-2 {
	  filter: invert(1) saturate(200%) contrast(0.5) contrast(2);
	}
	
	.invert.high-saturation.contrast-style-1.contrast-style-2 {
	  filter: invert(1) saturate(200%) contrast(1.5) contrast(2);
	}
	
	.grayscale.low-saturation.high-saturation.contrast-style-0 {
	  filter: grayscale(1) saturate(20%) saturate(200%) contrast(0.5);
	}
	
	.grayscale.low-saturation.high-saturation.contrast-style-1 {
	  filter: grayscale(1) saturate(20%) saturate(200%) contrast(1.5);
	}
	
	.grayscale.low-saturation.high-saturation.contrast-style-2 {
	  filter: grayscale(1) saturate(20%) saturate(200%) contrast(2);
	}
	
	.grayscale.low-saturation.contrast-style-0.contrast-style-1 {
	  filter: grayscale(1) saturate(20%) contrast(0.5) contrast(1.5);
	}
	
	.grayscale.low-saturation.contrast-style-0.contrast-style-2 {
	  filter: grayscale(1) saturate(20%) contrast(0.5) contrast(2);
	}
	
	.grayscale.low-saturation.contrast-style-1.contrast-style-2 {
	  filter: grayscale(1) saturate(20%) contrast(1.5) contrast(2);
	}
	
	.grayscale.high-saturation.contrast-style-0.contrast-style-1 {
	  filter: grayscale(1) saturate(200%) contrast(0.5) contrast(1.5);
	}
	
	.grayscale.high-saturation.contrast-style-0.contrast-style-2 {
	  filter: grayscale(1) saturate(200%) contrast(0.5) contrast(2);
	}
	
	.grayscale.high-saturation.contrast-style-1.contrast-style-2 {
	  filter: grayscale(1) saturate(200%) contrast(1.5) contrast(2);
	}
	
	.low-saturation.high-saturation.contrast-style-0.contrast-style-1 {
	  filter: saturate(20%) saturate(200%) contrast(0.5) contrast(1.5);
	}
	
	.low-saturation.high-saturation.contrast-style-0.contrast-style-2 {
	  filter: saturate(20%) saturate(200%) contrast(0.5) contrast(2);
	}
	
	.low-saturation.high-saturation.contrast-style-1.contrast-style-2 {
	  filter: saturate(20%) saturate(200%) contrast(1.5) contrast(2);
	}
	
	.hide-images img {
	  display: none;
	}
	
	.hide-video video {
	  display: none;
	}
	
	
	#cursor {
	  position: fixed;
	  z-index: 999999999;
	  pointer-events: none;
	  top: 0;
	  left: 0;
	}
	
	#cursor.cursor-0 {
	  width: 70px;
	  height: auto;
	  aspect-ratio: 1/1;
	  background: rgba(255, 0, 0, 0.5);
	  border: 2px solid var(--acc_color_2);
	  box-shadow: 0 0 20px 0 var(--acc_color_2);
	  border-radius: 50%;
	  mix-blend-mode: difference;
	  transition: all 0.1s ease;
	  transform-origin: center;
	  transform: translate(-50%, -50%);
	}
	
	#cursor.cursor-1 {
	  width: 100%;
	  height: 15vh;
	  background: transparent;
	  border: 10px solid var(--acc_color_2);
	  border-left: 0;
	  border-right: 0;
	  box-shadow: 0 0 0 100vh rgb(0 0 0 / 50%);
	  transition: none;
	  transform: translate(0, -50%);
	}
	
	#cursor.cursor-2 {
	  width: 25vw;
	  height: 8px;
	  background: var(--acc_color_1);
	  border: yellow 2px solid;
	  transition: all 0.1s ease;
	  transform-origin: center;
	  transform: translate(-50%, 50%);
	}
	
	#triangle-cursor {
	  width: 0;
	  height: 0;
	  border-left: 10px solid transparent;
	  border-right: 10px solid transparent;
	  border-bottom: 10px solid yellow;
	  position: fixed;
	  top: 0;
	  left: 0;
	  transform: translate(-50%, -50%);
	  transition: all 0.1s ease;
	  z-index: 999999998;
	  pointer-events: none;
	  display: none;
	}
`;
const accessibilityMenuHTML = `
	 <link
	href="https://fonts.googleapis.com/css2?family=Nunito&display=swap"
	rel="stylesheet"/>
	<div id="accessibility-modal" class="right close" role="dialog" aria-modal="true" aria-labelledby="acc-modal-title" style="z-index: 99999999;">
		<button id="closeBtn" aria-label="Close Accessibility Menu" style="z-index: 99999999;">
		  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-universal-access-circle" viewBox="0 0 16 16">
			<path d="M8 4.143A1.071 1.071 0 1 0 8 2a1.071 1.071 0 0 0 0 2.143m-4.668 1.47 3.24.316v2.5l-.323 4.585A.383.383 0 0 0 7 13.14l.826-4.017c.045-.18.301-.18.346 0L9 13.139a.383.383 0 0 0 .752-.125L9.43 8.43v-2.5l3.239-.316a.38.38 0 0 0-.047-.756H3.379a.38.38 0 0 0-.047.756Z" />
			<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8" />
		  </svg>
		</button>
		<div id="headerContent">
		  <p id="acc-modal-title">Accessibility Tools</p>
		</div>
		<div id="accessibility-tools">
	  
		  <!--invert colors-->
		  <div class="acc-item">
			<div class="acc-child" id="invert-colors" role="button" aria-pressed="false">
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet-half" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z" />
				<path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z" />
			  </svg>
			  <p>Invert Colours</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
				<div class="acc-progress-child acc-progress-child-3"></div>
			  </div>
			</div>
		  </div>
	  
		  <!--grayscale-->
		  <div class="acc-item">
			<div class="acc-child" id="grayscale" role="button" aria-pressed="false">
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-circle-half" viewBox="0 0 16 16">
				<path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
			  </svg>
			  <p>Grayscale</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
				<div class="acc-progress-child acc-progress-child-3"></div>
			  </div>
			</div>
		  </div>
	  
		  <!--saturation-->
		  <div class="acc-item">
			<div class="acc-child" id="saturation" role="button" aria-pressed="false">
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
				<path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
				<path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7" />
			  </svg>
			  <p>Low Saturation</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1 active"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
			  </div>
			</div>
		  </div>
	  
		  <!--links highlight-->
		  <div class="acc-item">
			<div class="acc-child" id="underline" role="button" aria-pressed="false">
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
				<path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
				<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
			  </svg>
			  <p>Links Highlight</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
				<div class="acc-progress-child acc-progress-child-3"></div>
			  </div>
			</div>
		  </div>
	  
		  <!--font size-->
		  <div class="acc-item">
			<div class="acc-child" id="font-size" role="button" aria-pressed="false">
			  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M17 12V17H17.5C17.7761 17 18 17.2239 18 17.5C18 17.7761 17.7761 18 17.5 18H15.5C15.2239 18 15 17.7761 15 17.5C15 17.2239 15.2239 17 15.5 17H16V12H14V12.5C14 12.7761 13.7761 13 13.5 13C13.2239 13 13 12.7761 13 12.5V11.5C13 11.2239 13.2239 11 13.5 11H19.5C19.7761 11 20 11.2239 20 11.5V12.5C20 12.7761 19.7761 13 19.5 13C19.2239 13 19 12.7761 19 12.5V12H17ZM10 6V17H11.5C11.7761 17 12 17.2239 12 17.5C12 17.7761 11.7761 18 11.5 18H7.5C7.22386 18 7 17.7761 7 17.5C7 17.2239 7.22386 17 7.5 17H9V6H5V7.5C5 7.77614 4.77614 8 4.5 8C4.22386 8 4 7.77614 4 7.5V5.5C4 5.22386 4.22386 5 4.5 5H14.5C14.7761 5 15 5.22386 15 5.5V7.5C15 7.77614 14.7761 8 14.5 8C14.2239 8 14 7.77614 14 7.5V6H10Z" fill="black" />
			  </svg>
			  <p>Font Size</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
				<div class="acc-progress-child acc-progress-child-3"></div>
			  </div>
			</div>
		  </div>
	  
	  
		  <!--contrast-->
		  <div class="acc-item">
			<div class="acc-child" id="contrast" role="button" aria-pressed="false">
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-transparency" viewBox="0 0 16 16">
				<path d="M0 6.5a6.5 6.5 0 0 1 12.346-2.846 6.5 6.5 0 1 1-8.691 8.691A6.5 6.5 0 0 1 0 6.5m5.144 6.358a5.5 5.5 0 1 0 7.714-7.714 6.5 6.5 0 0 1-7.714 7.714m-.733-1.269q.546.226 1.144.33l-1.474-1.474q.104.597.33 1.144m2.614.386a5.5 5.5 0 0 0 1.173-.242L4.374 7.91a6 6 0 0 0-.296 1.118zm2.157-.672q.446-.25.838-.576L5.418 6.126a6 6 0 0 0-.587.826zm1.545-1.284q.325-.39.576-.837L6.953 4.83a6 6 0 0 0-.827.587l4.6 4.602Zm1.006-1.822q.183-.562.242-1.172L9.028 4.078q-.58.096-1.118.296l3.823 3.824Zm.186-2.642a5.5 5.5 0 0 0-.33-1.144 5.5 5.5 0 0 0-1.144-.33z" />
			  </svg>
			  <p>Contrast</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
				<div class="acc-progress-child acc-progress-child-3"></div>
			  </div>
			</div>
		  </div>
	  
		  <!--hide images-->
		  <div class="acc-item">
			<div class="acc-child" id="hide-images" role="button" aria-pressed="false">
			  <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
				<path d="M4.8,4L4.8,4l1,1L4.8,4z M19.7,19L19.7,19l0.8,0.8L19.7,19z" />
				<path d="M18,7h-2c-0.5,0-1,0.5-1,1v2c0,0.5,0.5,1,1,1h2c0.5,0,1-0.5,1-1V8C19,7.5,18.5,7,18,7z M18,10h-2V8h2V10z" />
				<path d="M22,6.5v11c0,0.6-0.2,1.1-0.6,1.6l-0.6-0.6l-0.1-0.1l-4.9-4.9l0.3-0.3c0.2-0.2,0.5-0.2,0.7,0l4.2,4.1V6.5\tC21,5.7,20.3,5,19.5,5H7.4l-1-1h13.1C20.9,4,22,5.1,22,6.5z" />
				<path d="M1.9,1.1L1.1,1.9l2.4,2.4C2.6,4.6,2,5.5,2,6.5v11C2,18.9,3.1,20,4.5,20h14.8l2.9,2.9l0.7-0.7L1.9,1.1z M3,6.5\tC3,5.8,3.5,5.1,4.3,5l10,10l-0.8,0.8l-5.7-5.6c-0.2-0.2-0.5-0.2-0.7,0L3,14.3V6.5z M4.5,19C3.7,19,3,18.3,3,17.5v-1.8l4.5-4.5\tl5.7,5.6c0.2,0.2,0.5,0.2,0.7,0l1.1-1.1l3.3,3.3H4.5z" />
			  </svg>
			  <p>Hide image</p>
			</div>
		  </div>
	  
		  <!--hide video-->
		  <div class="acc-item">
			<div class="acc-child" id="hide-video" role="button" aria-pressed="false">
			  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video-off" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
			  </svg>
			  <p>Hide video</p>
			</div>
		  </div>
	  
		  <!--change cursor-->
		  <div class="acc-item">
			<div class="acc-child" id="change-cursor" role="button" aria-pressed="false">
			  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.85333 19.8536C8.58758 20.1193 8.13463 20.0079 8.02253 19.6492L3.02253 3.64915C2.90221 3.26413 3.26389 2.90246 3.64891 3.02278L19.6489 8.02278C20.0076 8.13487 20.1191 8.58782 19.8533 8.85357L16.2069 12.5L20.8533 17.1465C21.0486 17.3417 21.0486 17.6583 20.8533 17.8536L17.8533 20.8536C17.6581 21.0488 17.3415 21.0488 17.1462 20.8536L12.4998 16.2071L8.85333 19.8536ZM4.26173 4.26197L8.73053 18.5621L12.1462 15.1465C12.3415 14.9512 12.6581 14.9512 12.8533 15.1465L17.4998 19.7929L19.7927 17.5L15.1462 12.8536C14.951 12.6583 14.951 12.3417 15.1462 12.1465L18.5619 8.73078L4.26173 4.26197Z" fill="black" />
			  </svg>
			  <p>Change Cursors</p>
			  <div class="acc-progress-parent hidden">
				<div class="acc-progress-child acc-progress-child-1"></div>
				<div class="acc-progress-child acc-progress-child-2"></div>
				<div class="acc-progress-child acc-progress-child-3"></div>
			  </div>
			</div>
		  </div>
		</div>
	  
		<!--cursor and triangle cursor-->
		<div id="cursor"></div>
		<div id="triangle-cursor"></div>
	  
		<!--accessibility modal footer-->
		<div id="acc-footer">
	  
		  <!--reset all-->
		  <button id="reset-all">
			Reset All
		  </button>
	  
		  <!--change positions-->
		  <div id="change-positions">
			<button id="align-acc-left"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-start" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M1.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5" />
				<path d="M3 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
			  </svg></button>
			<button id="align-acc-top"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-top" viewBox="0 0 16 16">
				<rect width="4" height="12" rx="1" transform="matrix(1 0 0 -1 6 15)" />
				<path d="M1.5 2a.5.5 0 0 1 0-1zm13-1a.5.5 0 0 1 0 1zm-13 0h13v1h-13z" />
			  </svg></button>
			<button id="align-acc-bottom"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-bottom" viewBox="0 0 16 16">
				<rect width="4" height="12" x="6" y="1" rx="1" />
				<path d="M1.5 14a.5.5 0 0 0 0 1zm13 1a.5.5 0 0 0 0-1zm-13 0h13v-1h-13z" />
			  </svg></button>
			<button id="align-acc-right"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-end" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M14.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5" />
				<path d="M13 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z" />
			  </svg></button>
		  </div>
		</div>
	  </div>
`;

function coerceState(s) {
  if (!s) return s;
  const toBool = v => (String(v).toLowerCase() === 'true');
  const norm = String;

  return {
    widgetColor1: s.widgetColor1,
    widgetColor2: s.widgetColor2,

    invertColors: toBool(s.invertColors),
    grayscale: toBool(s.grayscale),

    saturation: ({none:'none',low:'low',high:'high'}[norm(s.saturation).toLowerCase()] || 'none'),

    underlineStyle: ({none:'none',style0:'style0',style1:'style1',style2:'style2'}[norm(s.underlineStyle).toLowerCase()] || 'none'),

    fontSize: String(s.fontSize || '').trim(), // can be '', '1.3rem', '1.5rem', '1.8rem', or a number

    contrast: ({none:'none',low:'low',medium:'medium',high:'high'}[norm(s.contrast).toLowerCase()] || 'none'),

    hideImages: toBool(s.hideImages),
    hideVideo:  toBool(s.hideVideo),

    cursorMode: ({none:'none',cursor0:'cursor0',cursor1:'cursor1',cursor2:'cursor2'}[norm(s.cursorMode).toLowerCase()] || 'none'),

    position: ({left:'left',top:'top',bottom:'bottom',right:'right'}[norm(s.position).toLowerCase()] || 'right')
  };
}

// ----- LISTEN for background -> content messages (set_widget_state) -----
browser.runtime.onMessage.addListener(message => {
  console.log("Message received in content script:", message);

  if (message.target === "content" && message.action === "set_widget_state") {
    if (!message.state) {
      console.warn("No widget state payload");
      return;
    }

    currentState = coerceState(message.state);

    if (!widgetInjected) {
      injectAndInit();
      // Ensure styles & DOM are present before applying
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          applyState(currentState);
        });
      });
    } else {
      applyState(currentState);
    }
  }
});

// ----- REQUEST state from background as the first action -----
document.addEventListener("DOMContentLoaded", function () {
	browser.runtime.sendMessage({
		target: "background",
		action: "get_widet_state",
		from: "content"
	});
});

// =============================
// Widget injection + behaviors
// =============================
let docElement, accessibilityModal, closeBtn, cursorEl, triangle;

function injectAndInit() {
	// 1) base styles
	const styleEl = document.createElement("style");
	styleEl.innerHTML = accessibilityMenuStyles;
	document.head.appendChild(styleEl);

	// 2) HTML
	document.body.insertAdjacentHTML("beforeend", accessibilityMenuHTML);

	// 3) Refs
	docElement = document.documentElement;
	accessibilityModal = document.getElementById('accessibility-modal');
	closeBtn = document.getElementById('closeBtn');
	cursorEl = document.getElementById('cursor');
	triangle = document.getElementById('triangle-cursor');

	// 4) Controls
	closeBtn.addEventListener('click', () => {
		accessibilityModal.classList.toggle('close');
		const isClosed = accessibilityModal.classList.contains('close');
		closeBtn.setAttribute('aria-expanded', String(!isClosed));
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !accessibilityModal.classList.contains('close')) {
			accessibilityModal.classList.add('close');
			closeBtn.setAttribute('aria-expanded', 'false');
		}
	});

	// Tool toggles
	const tools = [
		{ id: 'invert-colors', className: 'invert' },
		{ id: 'grayscale', className: 'grayscale' },
		{ id: 'hide-images', className: 'hide-images' },
		{ id: 'hide-video', className: 'hide-video' }
	];
	tools.forEach(({ id, className }) => {
		const el = document.getElementById(id);
		if (el) {
			el.addEventListener('click', () => {
				docElement.classList.toggle(className);
				el.querySelector('.acc-child')?.classList.toggle('active');
				sendUpdate();
			});
		}
	});

	// Position buttons
	const alignAccLeft = document.getElementById('align-acc-left');
	const alignAccTop = document.getElementById('align-acc-top');
	const alignAccBottom = document.getElementById('align-acc-bottom');
	const alignAccRight = document.getElementById('align-acc-right');

	function clearPositions() {
		accessibilityModal.classList.remove('left', 'top', 'bottom', 'right');
	}

	alignAccLeft.addEventListener('click', () => { clearPositions(); accessibilityModal.classList.add('left'); sendUpdate(); });
	alignAccTop.addEventListener('click', () => { clearPositions(); accessibilityModal.classList.add('top'); sendUpdate(); });
	alignAccBottom.addEventListener('click', () => { clearPositions(); accessibilityModal.classList.add('bottom'); sendUpdate(); });
	alignAccRight.addEventListener('click', () => { clearPositions(); accessibilityModal.classList.add('right'); sendUpdate(); });

	// Saturation cycler
	let saturationClickCount = 0;
	const saturationClasses = ['', 'low-saturation', 'high-saturation'];
	document.getElementById('saturation').addEventListener('click', () => {
		docElement.classList.remove('low-saturation', 'high-saturation');
		saturationClickCount = (saturationClickCount + 1) % saturationClasses.length;
		if (saturationClickCount > 0) docElement.classList.add(saturationClasses[saturationClickCount]);
		sendUpdate();
	});

	// Underline cycler
	let underlineClickCount = 0;
	const underlineClasses = ['', 'underline-style-0', 'underline-style-1', 'underline-style-2'];
	document.getElementById('underline').addEventListener('click', () => {
		docElement.classList.remove('underline-style-0', 'underline-style-1', 'underline-style-2');
		underlineClickCount = (underlineClickCount + 1) % underlineClasses.length;
		if (underlineClickCount > 0) docElement.classList.add(underlineClasses[underlineClickCount]);
		sendUpdate();
	});

	// Font Size cycler
	// === Font Size ===
	const fontSizes = ['', '1.3rem', '1.5rem', '1.8rem'];

	// read current inline (what we set in applyState)
	function currentInlineRootFontSize() {
		return document.documentElement.style.getPropertyValue('font-size').trim();
	}

	// seed after applyState runs (we set a default now, then reset below)
	let fontSizeClickIndex = 0;

	document.getElementById('font-size').addEventListener('click', () => {
		fontSizeClickIndex = (fontSizeClickIndex + 1) % fontSizes.length;
		const nextVal = fontSizes[fontSizeClickIndex];

		if (nextVal) {
			document.documentElement.style.setProperty('font-size', nextVal, 'important');
		} else {
			document.documentElement.style.removeProperty('font-size');
		}
		sendUpdate();
	});

	// Contrast cycler
	let contrastClickCount = 0;
	const contrastClasses = ['', 'contrast-style-0', 'contrast-style-1', 'contrast-style-2'];
	document.getElementById('contrast').addEventListener('click', () => {
		docElement.classList.remove('contrast', 'contrast-style-0', 'contrast-style-1', 'contrast-style-2');
		contrastClickCount = (contrastClickCount + 1) % contrastClasses.length;
		if (contrastClickCount > 0) {
			docElement.classList.add('contrast');
			docElement.classList.add(contrastClasses[contrastClickCount]);
		}
		sendUpdate();
	});

	// Cursor change
	let cursorClickCount = 0;
	const cursorClasses = ['', 'cursor-0', 'cursor-1', 'cursor-2'];
	document.getElementById('change-cursor').addEventListener('click', () => {
		cursorEl.classList.remove('cursor-0', 'cursor-1', 'cursor-2');
		docElement.style.cursor = '';

		cursorClickCount = (cursorClickCount + 1) % cursorClasses.length;

		if (cursorClickCount === 1) {
			cursorEl.classList.add('cursor-0');
			cursorEl.style.width = '50px';
			cursorEl.style.height = '50px';
		} else if (cursorClickCount === 2) {
			cursorEl.classList.add('cursor-1');
		} else if (cursorClickCount === 3) {
			cursorEl.classList.add('cursor-2');
			docElement.style.cursor = 'none';
			triangle.style.display = 'block';
		} else {
			triangle.style.display = 'none';
		}

		sendUpdate();
	});

	// Cursor movement tracking
	document.addEventListener('mousemove', e => {
		if (cursorEl.classList.contains('cursor-0')) {
			cursorEl.style.top = e.clientY + 'px';
			cursorEl.style.left = e.clientX + 'px';
		} else if (cursorEl.classList.contains('cursor-1')) {
			cursorEl.style.top = e.clientY + 'px';
			cursorEl.style.left = '0px';
		} else if (cursorEl.classList.contains('cursor-2')) {
			cursorEl.style.top = e.clientY + 'px';
			cursorEl.style.left = e.clientX + 'px';
			triangle.style.top = e.clientY + 'px';
			triangle.style.left = e.clientX + 'px';
		}
	});

	// Reset All
	document.getElementById('reset-all').addEventListener('click', () => {
		docElement.className = '';
		document.documentElement.style.removeProperty('font-size'); // remove inline font-size set with !important
		cursorEl.className = '';
		docElement.style.cursor = '';
		triangle.style.display = 'none';

		// reset all local counters/indices
		saturationClickCount = 0;
		underlineClickCount = 0;
		fontSizeClickIndex = 0;  // <— important so the next click starts from default
		contrastClickCount = 0;
		cursorClickCount = 0;

		sendUpdate();
	});

	// Apply initial state from background
	applyState(currentState);
	// Seed font-size cycler from the inline value set by applyState
	(() => {
		const cur = currentInlineRootFontSize();
		const idx = fontSizes.indexOf(cur);
		fontSizeClickIndex = idx >= 0 ? idx : 0;
	})();

	widgetInjected = true;
	console.log("Accessibility widget injected.");
}


function normalizeFontSize(v) {
	if (v == null) return '';
	const s = String(v).trim();
	if (!s) return '';
	// already has a unit? keep it
	if (/(rem|em|px|%|pt)$/i.test(s)) return s;
	// numeric only -> treat as rem
	if (!Number.isNaN(Number(s))) return `${s}rem`;
	return ''; // anything else: ignore
}

// --- Apply state to DOM ---
function applyState(s) {
	// Colors (validate)
	const setColors = (c1, c2) => {
		const colorStyle = document.getElementById('acc-color-style') || (() => {
			const el = document.createElement('style');
			el.id = 'acc-color-style';
			document.head.appendChild(el);
			return el;
		})();
		colorStyle.innerHTML = `:root{--acc_color_1:${c1};--acc_color_2:${c2};}`;
	};

	const valid = v => {
		const o = new Option().style;
		o.color = '';
		o.color = (v || '').trim();
		return o.color !== '';
	};

	const c1 = valid(s.widgetColor1) ? s.widgetColor1 : '#000';
	const c2 = valid(s.widgetColor2) ? s.widgetColor2 : '#fff';
	setColors(c1, c2);

	//font size
	const normalizedFS = normalizeFontSize(s.fontSize);
	if (normalizedFS) {
		document.documentElement.style.setProperty('font-size', normalizedFS, 'important');
	} else {
		document.documentElement.style.removeProperty('font-size');
	}

	// Classes
	docElement.className = '';
	if (s.invertColors) docElement.classList.add('invert');
	if (s.grayscale) docElement.classList.add('grayscale');

	if (s.saturation === 'low') docElement.classList.add('low-saturation');
	if (s.saturation === 'high') docElement.classList.add('high-saturation');

	if (s.underlineStyle === 'style0') docElement.classList.add('underline-style-0');
	if (s.underlineStyle === 'style1') docElement.classList.add('underline-style-1');
	if (s.underlineStyle === 'style2') docElement.classList.add('underline-style-2');

	if (s.contrast === 'low') { docElement.classList.add('contrast', 'contrast-style-0'); }
	if (s.contrast === 'medium') { docElement.classList.add('contrast', 'contrast-style-1'); }
	if (s.contrast === 'high') { docElement.classList.add('contrast', 'contrast-style-2'); }

	if (s.hideImages) docElement.classList.add('hide-images');
	if (s.hideVideo) docElement.classList.add('hide-video');

	// Cursor
	cursorEl.className = '';
	triangle.style.display = 'none';
	docElement.style.cursor = '';
	if (s.cursorMode === 'cursor0') cursorEl.classList.add('cursor-0');
	if (s.cursorMode === 'cursor1') cursorEl.classList.add('cursor-1');
	if (s.cursorMode === 'cursor2') {
		cursorEl.classList.add('cursor-2');
		docElement.style.cursor = 'none';
		triangle.style.display = 'block';
	}

	// Position
	accessibilityModal.classList.remove('left', 'top', 'bottom', 'right');
	accessibilityModal.classList.add(s.position || 'right');

	// --- Active-state + progress sync for ALL controls ---
function syncWidgetUI(s) {
  const html = document.documentElement;

  // basic tile active helper
  const syncActive = (id, on) => {
    const node = document.getElementById(id);
    if (!node) return;
    const tile = node.querySelector('.acc-child');
    if (!tile) return;
    tile.classList.toggle('active', !!on);
  };

  // progress bars helper: mark first N bars as active
  const setProgress = (id, level /* 0..3 */) => {
    const node = document.getElementById(id);
    if (!node) return;
    const bars = node.querySelectorAll('.acc-progress-child');
    bars.forEach((bar, i) => bar.classList.toggle('active', i < level));
    // tile “active” when level > 0
    const tile = node.querySelector('.acc-child');
    if (tile) tile.classList.toggle('active', level > 0);
  };

  // -----------------------
  // Binary toggles
  // -----------------------
  syncActive('invert-colors',  html.classList.contains('invert'));
  syncActive('grayscale',      html.classList.contains('grayscale'));
  syncActive('hide-images',    html.classList.contains('hide-images'));
  syncActive('hide-video',     html.classList.contains('hide-video'));

  // -----------------------
  // Saturation (none/low/high) -> 0/1/2 bars
  // -----------------------
  const satLevel = s.saturation === 'high' ? 2 : s.saturation === 'low' ? 1 : 0;
  setProgress('saturation', satLevel);

  // -----------------------
  // Underline (none/style0/style1/style2) -> 0/1/2/3 bars
  // -----------------------
  const underlineLevel =
    s.underlineStyle === 'style2' ? 3 :
    s.underlineStyle === 'style1' ? 2 :
    s.underlineStyle === 'style0' ? 1 : 0;
  setProgress('underline', underlineLevel);

  // -----------------------
  // Font size (''/1.3rem/1.5rem/1.8rem) -> 0/1/2/3 bars
  // -----------------------
  const fs = String(s.fontSize || '').trim().toLowerCase();
  const fsLevel = fs === '1.8rem' ? 3 : fs === '1.5rem' ? 2 : fs === '1.3rem' ? 1 : 0;
  setProgress('font-size', fsLevel);

  // -----------------------
  // Contrast (none/low/medium/high) -> 0/1/2/3 bars
  // -----------------------
  const contrastLevel =
    s.contrast === 'high' ? 3 :
    s.contrast === 'medium' ? 2 :
    s.contrast === 'low' ? 1 : 0;
  setProgress('contrast', contrastLevel);

  // -----------------------
  // Cursor (none/cursor0/cursor1/cursor2) -> 0/1/2/3 bars
  // -----------------------
  const cursorLevel =
    s.cursorMode === 'cursor2' ? 3 :
    s.cursorMode === 'cursor1' ? 2 :
    s.cursorMode === 'cursor0' ? 1 : 0;
  setProgress('change-cursor', cursorLevel);

  // -----------------------
  // Position buttons (left/top/bottom/right) -> .active on the chosen one
  // -----------------------
  const posButtons = [
    ['align-acc-left', 'left'],
    ['align-acc-top', 'top'],
    ['align-acc-bottom', 'bottom'],
    ['align-acc-right', 'right']
  ];
  posButtons.forEach(([id, pos]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.classList.toggle('active', (s.position || 'right') === pos);
  });
}
syncWidgetUI(s);
}

// --- Send updated state back to background (merging only the bits content controls) ---
function sendUpdate() {
	const updated = {
		// derive from DOM
		invertColors: document.documentElement.classList.contains('invert'),
		grayscale: document.documentElement.classList.contains('grayscale'),
		saturation:
			document.documentElement.classList.contains('low-saturation') ? 'low' :
				document.documentElement.classList.contains('high-saturation') ? 'high' : 'none',
		underlineStyle:
			document.documentElement.classList.contains('underline-style-0') ? 'style0' :
				document.documentElement.classList.contains('underline-style-1') ? 'style1' :
					document.documentElement.classList.contains('underline-style-2') ? 'style2' : 'none',
		fontSize: document.documentElement.style.getPropertyValue('font-size') || '',
		contrast:
			document.documentElement.classList.contains('contrast-style-0') ? 'low' :
				document.documentElement.classList.contains('contrast-style-1') ? 'medium' :
					document.documentElement.classList.contains('contrast-style-2') ? 'high' : 'none',
		hideImages: document.documentElement.classList.contains('hide-images'),
		hideVideo: document.documentElement.classList.contains('hide-video'),

		cursorMode:
			(document.getElementById('cursor').classList.contains('cursor-0')) ? 'cursor0' :
				(document.getElementById('cursor').classList.contains('cursor-1')) ? 'cursor1' :
					(document.getElementById('cursor').classList.contains('cursor-2')) ? 'cursor2' : 'none',

		position:
			document.getElementById('accessibility-modal').classList.contains('left') ? 'left' :
				document.getElementById('accessibility-modal').classList.contains('top') ? 'top' :
					document.getElementById('accessibility-modal').classList.contains('bottom') ? 'bottom' : 'right'
	};

	browser.runtime.sendMessage({
		target: "background",
		action: "update_widget_state",
		from: "content",
		updatedState: updated
	});
}