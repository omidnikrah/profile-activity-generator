class Generator {
  constructor() {
    this.days = document.getElementsByClassName('day');
    this.profileActivitySVG = document.getElementById('profile-activity');
    this.createImageButton = document.getElementById('create-image-btn');
    this.resetActivityButton = document.getElementById('reset-activity-btn');
    this.toneUpButton = document.getElementById('tone-up-btn');
    this.toneDownButton = document.getElementById('tone-down-btn');
    this.daysActivity = {};
    this.isCtrlPressed = false;
    this.renderActivity(7, 52, 16);
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].addEventListener('click', (event) => this.handleDayClick(event, i), false);
      this.days[i].addEventListener('mouseover', (event) => this.handleDayHover(event, i), false);
    }
    this.createImageButton.addEventListener('click', this.createImage, false);
    this.resetActivityButton.addEventListener('click', this.resetActivity, false);
    this.toneUpButton.addEventListener('click', this.toneUp, false);
    this.toneDownButton.addEventListener('click', this.toneDown, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
  }

  renderActivity = (x, y, distance) => {
    let activityDOM = '';
    let idx = 0;
    for (let indexY = 0; indexY < y; indexY++) {
      activityDOM += `
        <g transform="translate(${indexY * distance}, 0)">
      `;
      for (let indexX = 0; indexX < x; indexX++) {
        activityDOM += `<rect class="day" width="11" height="11" x="${distance - indexY}" y="${indexX * (distance - 1)}" fill="#ebedf0" id="${idx}"></rect>`;
        idx += 1;
      }
      activityDOM += '</g>';
    }
    this.profileActivitySVG.insertAdjacentHTML('beforeend', activityDOM);
  }

  handleKeyDown = (event) => {
    if (event.which === 91) {
      this.isCtrlPressed = true;
    }
  }

  handleKeyUp = (event) => {
    if (event.which === 91) {
      this.isCtrlPressed = false;
    }
  }

  handleDayHover = (event, index) => {
    if (this.isCtrlPressed) {
      this.handleDayClick(event, index);
    }
  }

  handleDayClick = (event, index) => {
    this.daysActivity[index] = this.daysActivity[index] ? this.daysActivity[index] + 1 : 1;
    switch(this.daysActivity[index]) {
      case 1:
        event.target.setAttribute('fill', '#c6e48b');
        break;
      case 2:
        event.target.setAttribute('fill', '#7bc96f');
        break;
      case 3:
        event.target.setAttribute('fill', '#239a3b');
        break;
      case 4:
        event.target.setAttribute('fill', '#196127');
        break;
      case 5:
        event.target.setAttribute('fill', '#ebedf0');
        this.daysActivity[index] = 0;
        break;
    }
  }

  toneUp = (event) => {
    for (let i = 0; i < this.days.length; i++) {
      if(this.daysActivity[i]) {
        if(this.daysActivity[i] === 4) {
          this.daysActivity[i] = 0;
        } else {
          this.daysActivity[i] += 1;
        }
      } else {
        this.daysActivity[i] = 1;
      }

      switch(this.daysActivity[i]) {
        case 1:
          document.getElementById(i).setAttribute('fill', '#c6e48b');
          break;
        case 2:
          document.getElementById(i).setAttribute('fill', '#7bc96f');
          break;
        case 3:
          document.getElementById(i).setAttribute('fill', '#239a3b');
          break;
        case 4:
          document.getElementById(i).setAttribute('fill', '#196127');
          break;
        case 0:
          document.getElementById(i).setAttribute('fill', '#ebedf0');
          break;
      }
    }
  };

  toneDown = (event) => {
    for (let i = 0; i < this.days.length; i++) {
      if(this.daysActivity[i]) {
        if(this.daysActivity[i] === 0) {
          this.daysActivity[i] = 4;
        } else {
          this.daysActivity[i] -= 1;
        }
      } else {
        this.daysActivity[i] = 4;
      }

      switch(this.daysActivity[i]) {
        case 1:
          document.getElementById(i).setAttribute('fill', '#c6e48b');
          break;
        case 2:
          document.getElementById(i).setAttribute('fill', '#7bc96f');
          break;
        case 3:
          document.getElementById(i).setAttribute('fill', '#239a3b');
          break;
        case 4:
          document.getElementById(i).setAttribute('fill', '#196127');
          break;
        case 0:
          document.getElementById(i).setAttribute('fill', '#ebedf0');
          break;
      }
    }
  };

  createImage = () => {
    const serialized = new XMLSerializer().serializeToString(this.profileActivitySVG);
    const encodedData = window.btoa(serialized);
    this.createImageTag(encodedData);
  }

  resetActivity = () => {
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].setAttribute('fill', '#ebedf0');
    }
  }

  createImageTag = (src) => {
    const image = new Image();
    image.src = `data:image/svg+xml;base64,${src}`;
    image.onload = function() {
      const canvas = document.createElement('canvas');
      const downloadLink = document.createElement('a');
      const context = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      downloadLink.download = 'result.png';
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.click();
    }
  }
}

new Generator();
