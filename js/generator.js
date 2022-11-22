class Generator {
  constructor() {
    this.days = document.getElementsByClassName('day');
    this.profileActivitySVG = document.getElementById('profile-activity');
    this.createImageButton = document.getElementById('create-image-btn');
    this.resetActivityButton = document.getElementById('reset-activity-btn');
    this.daysActivity = {};
    this.isCtrlPressed = false;
    this.isShiftPressed = false;
    this.renderActivity(7, 52, 16);
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].addEventListener('click', (event) => this.handleDayClick(event, i), false);
      this.days[i].addEventListener('mouseover', (event) => this.handleDayHover(event, i), false);
    }
    this.createImageButton.addEventListener('click', this.createImage, false);
    this.resetActivityButton.addEventListener('click', this.resetActivity, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
    this.theme = 'light';
    this.switchThemeButton = document.getElementById('switch-theme-btn');
    this.switchThemeButton.addEventListener('click', this.switchTheme, false);
  }

  renderActivity = (x, y, distance) => {
    let activityDOM = '';
    for (let indexY = 0; indexY < y; indexY++) {
      activityDOM += `
        <g transform="translate(${indexY * distance}, 0)">
      `;
      for (let indexX = 0; indexX < x; indexX++) {
        activityDOM += `<rect class="day" width="11" height="11" x="${distance - indexY}" y="${indexX * (distance - 1)}" fill="#ebedf0"></rect>`;
      }
      activityDOM += '</g>';
    }
    this.profileActivitySVG.insertAdjacentHTML('beforeend', activityDOM);
  }

  handleKeyDown = (event) => {
    if (event.which === 91) {
      this.isCtrlPressed = true;
    }
    if (event.which === 16) {
      this.isShiftPressed = true;
    }
  }

  handleKeyUp = (event) => {
    if (event.which === 91) {
      this.isCtrlPressed = false;
    }
    if (event.which === 16) {
      this.isShiftPressed = false;
    }

  }

  handleDayHover = (event, index) => {
    if (this.isCtrlPressed) {
      this.handleDayClick(event, index);
    }
  }

  handleDayClick = (event, index, modifier=1-(this.isShiftPressed*2)) => {
    this.daysActivity[index] = this.daysActivity[index] ? Math.max(0, Math.min(4, this.daysActivity[index] + modifier)) : +(!this.isShiftPressed);
    switch(this.daysActivity[index]) {
      case 0:
        event.target.setAttribute('fill', '#ebedf0');
        break;
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
    }
  }

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

  switchTheme = () => {
    if(this.theme === 'light') {
      this.theme = 'dark';
      this.switchThemeButton.classList.add('dark-theme-btn');
      this.switchThemeButton.classList.remove('light-theme-btn');
    } else {
      this.theme = 'light';
      this.switchThemeButton.classList.add('light-theme-btn');
      this.switchThemeButton.classList.remove('dark-theme-btn');
    }
    let days = Array.prototype.slice.call(this.days);
    days.forEach((day) => {
      if(this.theme === 'dark') {
        if(day.getAttribute('fill') === '#ebedf0') {
          day.setAttribute('fill', '#2d333b');
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
        }
      } else if(this.theme === 'light') {
        if(day.getAttribute('fill') === '#2d333b') {
          day.setAttribute('fill', '#ebedf0')
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
        }
      }
    })
  }
}

new Generator();
