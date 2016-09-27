/**
 Author: Mahdi Jaberzadeh Ansari
 Email: mahdijaberzadehansari@yahoo.co.uk
 Library: ImageRotatorJS
 Description: By using this library you can create beautiful image rotator banners for your website.
 Licence: MIT Licence
 Version 1.0.7
 Date: 223 Sep 2016
 */
// JavaScript Document
var ImageRotatorJS = function(containerId, // id of the parent div
                              elementsClass, // All the elements (IMG tags) are needed to have same class name.
                              rotationSpeed, //10 = 0.01 second
                              zoomPercentage,
                              holdDelay, // A number in milliseconds that tells how much it has to wait between rotations.
                              rotationAngle, // +/- 0~360 degree. If we assume a Z axis orthogonal to the screen, then 45 degrees cause to sloop images to the screen
                              startAngle, // +/- 0-360 degree. The initial position of the first image
                              reflectionPercentage, // 0~100. The amount of reflection of images
                              circumferenceDotsColor) {
    "use strict";
    var MJZImageRotatorJS = function(parentDivDOM,
                           elementsClass,
                           rotationSpeed,
                           zoomPercentage,
                           holdDelay,
                           rotationAngle,
                           startAngle,
                           reflectionPercentage,
                           circumferenceDotsColor) {
        "use strict";
        // Just needs to check first argument. Others have default value.
        if (!parentDivDOM || typeof parentDivDOM !== 'object') {
            throw 'Cannot find the container in DOM. Check the containerId that you passed.';
        }
        var _this = this;
        // defining needed functions first
        /*
         This functions inserts a node after a given node
         */
        this.insertAfter = function(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        };
        /*
         This function checks the validity of a given argument
         */
        this.isValidNumber = (function() {
            "use strict";
            var rx = /^-/;
            return function(n) {
                return Object.prototype.toString.call(n) !== '[object Array]' && !isNaN(parseFloat(n)) && isFinite(n.toString().replace(rx, ''));
            };
        }());
        /*
         This function sets the timeout for a given element
         */
        this.setTimeOut = function(IRJS_Function_Name, Rotate_Delay) {
            "use strict";
            this.idOfSetTimeout = setTimeout('window.' + this.ref + '.' + IRJS_Function_Name, Rotate_Delay);
        };
        /*
         This function receives a set of CSS style and sets them for the given element.
         */
        this.setStyle = function(element, elementStyle) {
            "use strict";
            if (typeof(element) == 'string')
                element = document.createElement(element);
            if (typeof(element) != 'object')
                throw 'The passed element is not an object.';
            for (var key in elementStyle)
                element.style[key] = elementStyle[key];
            return element;
        };
        /*
         This function changes the position of all elements and sets a timeout for next action at the end.
         */
        this.position = function(rotateDirection, holdDelay) {
            "use strict";
            this.rotatingSwitch = true;
            this.rotateDirection = rotateDirection || this.rotateDirection;
            this.holdDelay = holdDelay || this.holdDelay;
            this.Counter += this.rotateDirection;
            if (this.Counter >= this.inc) //happen when rotateDirection==1
                this.Counter = 0;
            if (this.Counter < 0) //happen when rotateDirection==-1
                this.Counter = this.inc - 1;
            for (var _i = 0; _i < this.items.length; _i++) // Transfer all the objects to the next place
            {
                var IRJS_Current_Position = (this.Counter + this.items[_i].StaticPosition) % this.aary.length; // New place of the object
                if (this.rotateDirection == 1) {
                    if (IRJS_Current_Position == (this.aary.length - 1) && _i != 0) {
                        this.CurrentItem = _i;
                        this.items[_i].setAttribute('class', 'CurrentPlayedIcon');
                    } else if (IRJS_Current_Position == 0 && _i == 0) {
                        this.CurrentItem = _i;
                        this.items[_i].setAttribute('class', 'CurrentPlayedIcon');
                    } else
                        this.items[_i].setAttribute('class', 'NotCurrentIcon');
                } else if (this.rotateDirection == -1) {
                    if (IRJS_Current_Position == (this.aary.length - 1) && _i != 0) {
                        this.CurrentItem = _i;
                        this.items[_i].setAttribute('class', 'CurrentPlayedIcon');
                    } else if (IRJS_Current_Position == 0 && _i == 0) {
                        this.CurrentItem = _i;
                        this.items[_i].setAttribute('class', 'CurrentPlayedIcon');
                    } else
                        this.items[_i].setAttribute('class', 'NotCurrentIcon');
                }
                if (this.RequestedIcon == this.items[_i] && this.CurrentItem == _i) { //if you reach to requested icon stop
                    this.RequestedIcon = null;
                    this.stop = Math.floor(this.inc / this.items.length);
                    break;
                }
                var IRJS_Ratio = Math.abs(Math.sin(this.aary[IRJS_Current_Position][2]) * this.zoomPercentage);
                var IRJS_Width = Math.sin(this.aary[IRJS_Current_Position][2]) >= 0 ? (this.sizes[_i][0] + this.sizes[_i][0] * IRJS_Ratio) : (this.sizes[_i][0] - this.sizes[_i][0] * IRJS_Ratio / 2);
                IRJS_Width = IRJS_Width > 0 ? IRJS_Width : 0;
                var IRJS_Height = Math.sin(this.aary[IRJS_Current_Position][2]) >= 0 ? (this.sizes[_i][1] + this.sizes[_i][1] * IRJS_Ratio) : (this.sizes[_i][1] - this.sizes[_i][1] * IRJS_Ratio / 2);
                IRJS_Height = IRJS_Height > 0 ? IRJS_Height : 0;
                this.items[_i].CurrentPosition = this.aary[IRJS_Current_Position][4]; // false --> left; true --> right; null --> position 0
                this.setStyle(this.items[_i], {
                    zIndex: Math.floor(this.aary[IRJS_Current_Position][1] + 1) + '',
                    width: IRJS_Width + 'px',
                    height: IRJS_Height + 'px',
                    left: (this.aary[IRJS_Current_Position][0] - IRJS_Width / 2) + 'px',
                    top: (this.aary[IRJS_Current_Position][1] - IRJS_Height + 1) + 'px',
                    fontSize: (this.sizes[_i][2] + (this.sizes[_i][2] * IRJS_Ratio)) + 'px'
                });
                this.setStyle(this.Reflects[_i], {
                    zIndex: Math.floor(this.aary[IRJS_Current_Position][1] + 2) + '',
                    width: IRJS_Width + 'px',
                    height: (IRJS_Height * this.reflectionPercentage) + 'px',
                    left: (this.aary[IRJS_Current_Position][0] - IRJS_Width / 2) + 'px',
                    top: (this.aary[IRJS_Current_Position][1] - 1) + 'px',
                    fontSize: (this.sizes[_i][2] + (this.sizes[_i][2] * IRJS_Ratio)) + 'px'
                });
                this.setStyle(this.Overlay[_i], {
                    zIndex: Math.floor(this.aary[IRJS_Current_Position][1] + 3) + '',
                    width: IRJS_Width + 'px',
                    height: (IRJS_Height * this.reflectionPercentage + 5) + 'px',
                    left: (this.aary[IRJS_Current_Position][0] - IRJS_Width / 2) + 'px',
                    top: (this.aary[IRJS_Current_Position][1] - 1) + 'px',
                    fontSize: (this.sizes[_i][2] + (this.sizes[_i][2] * IRJS_Ratio)) + 'px'
                });
                if (Math.sin(this.aary[IRJS_Current_Position][2]) < -0.5) {
                    this.setStyle(this.items[_i], {
                        '-webkit-filter': 'blur(2px)',
                        filter: 'url(#blur)',
                        '-moz-filter': 'blur(2px)',
                        '-o-filter': 'blur(2px)',
                        '-ms-filter': 'blur(2px)'
                    });
                    if (navigator.appName !== 'Microsoft Internet Explorer')
                        this.setStyle(this.Reflects[_i].querySelector('img'), {
                            '-webkit-filter': 'blur(2px)',
                            filter: 'url(#blur)',
                            '-moz-filter': 'blur(2px)',
                            '-o-filter': 'blur(2px)',
                            '-ms-filter': 'blur(2px)'
                        });
                } else {
                    this.setStyle(this.items[_i], {
                        filter: '',
                        '-webkit-filter': '',
                        '-moz-filter': '',
                        '-o-filter': '',
                        '-ms-filter': ''
                    });
                    if (navigator.appName !== 'Microsoft Internet Explorer')
                        this.setStyle(this.Reflects[_i].querySelector('img'), {
                            filter: '',
                            '-webkit-filter': '',
                            '-moz-filter': '',
                            '-o-filter': '',
                            '-ms-filter': ''
                        });
                }
                var _this = this;
                this.items[_i].onclick = function() {
                    if (_this.CurrentItem != -1 ? _this.items[_this.CurrentItem] != this : true) {
                        _this.RequestedIcon = this;
                        if (this.CurrentPosition) { //The object positioned on the right side of start point
                            clearTimeout(_this.idOfSetTimeout);
                            _this.stop = 0;
                            _this.position(1, _this.holdDelay);
                        } else { //The object positioned on the left side of start point
                            clearTimeout(_this.idOfSetTimeout);
                            _this.stop = 0;
                            _this.position(-1, _this.holdDelay);
                        }
                    } else if (_this.items[_this.CurrentItem] == this && !_this.rotatingSwitch) {
                        _this.position(_this.rotateDirection, _this.holdDelay);
                    } else {
                        _this.rotatingSwitch = false;
                        clearTimeout(_this.idOfSetTimeout);
                        if (_this.rotateDirection == 1)
                            this.setAttribute('class', 'CurrentPausedIconRTL');
                        else
                            this.setAttribute('class', 'CurrentPausedIconLTR');
                    }
                }
            }
            if (this.Counter % this.stop != 0) {
                this.setTimeOut('position();', this.rotationSpeed);
            } else if (this.holdDelay) {
                this.setTimeOut('position();', this.holdDelay);
            }
        };
        /*
         The following 2 functions are not used inside of the library but can be used by the user to bind some Start/Stop switch to the object.
         */
        this.startRotation = function(rotateDirection, holdDelay) {
            "use strict";
            clearTimeout(_this.idOfSetTimeout); //The ID value returned by setTimeout() is used as the parameter for the clearTimeout() method.
            _this.position(rotateDirection, holdDelay);
        };
        this.stopRotation = function() {
            "use strict";
            _this.rotatingSwitch = false;
            clearTimeout(_this.idOfSetTimeout); //The ID value returned by setTimeout() is used as the parameter for the clearTimeout() method.
        };
        // set the arguments
        this.parentDivDOM = parentDivDOM;
        this.rotationSpeed = this.isValidNumber(rotationSpeed) ? rotationSpeed : 10; //10 = 0.01 second
        this.holdDelay = this.isValidNumber(holdDelay) ? holdDelay : 3000;
        this.zoomPercentage = this.isValidNumber(zoomPercentage) ? zoomPercentage / 100 : 0.01;
        this.diagonal = [parseInt(this.parentDivDOM.style.width || this.parentDivDOM.offsetWidth),
            parseInt(this.parentDivDOM.style.height || this.parentDivDOM.offsetHeight)
        ];
        this.items = [];
        this.Reflects = [];
        this.Overlay = [];
        // Push the needed styles inside of the header
        this.setStyle(this.parentDivDOM, {
            cursor: 'default',
            'text-align': 'center',
            'margin-left': 'auto',
            'margin-right': 'auto'
        });
        var css = ' .' + elementsClass + ':hover{cursor:pointer}';
        css += ' .CurrentPlayedIcon:hover{cursor:pointer}';
        css += ' .CurrentPausedIconRTL:hover{cursor:pointer}';
        css += ' .CurrentPausedIconLTR:hover{cursor:,pointer}';
        css += ' .NotCurrentIcon:hover{cursor:pointer}';
        var style = document.createElement('style');
        if (style.styleSheet)
            style.styleSheet.cssText = css;
        else
            style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style);
        var childElements = this.parentDivDOM.getElementsByTagName('*');
        for (var _i = 0; _i < childElements.length; _i++) {
            if (childElements[_i].className) {
                if (childElements[_i].className.match(elementsClass)) {
                    this.items.push(childElements[_i]);
                    var newNode = document.createElement('div');
                    this.insertAfter(childElements[_i], newNode);
                    this.Reflects.push(newNode);
                    var newImg = document.createElement('img');
                    newImg.src = childElements[_i].src;
                    this.setStyle(newImg, {
                        width: '100%',
                        border: 'none',
                        WebkitTransform: 'scaleY(-1)',
                        MozTransform: 'scaleY(-1)',
                        MsTransform: 'scaleY(-1)',
                        OTransform: 'scaleY(-1)',
                        transform: 'scaleY(-1)',
                        filter: 'flipv'
                    });
                    newNode.appendChild(newImg);
                    newNode = document.createElement('div');
                    this.insertAfter(this.Reflects[this.Reflects.length - 1], newNode);
                    newNode.setAttribute('class', 'IRJS_Overlay');
                    this.Overlay.push(newNode);
                }
            }
        }
        this.aary = new Array();
        this.Start_Point = Math.PI / 2;
        if (this.isValidNumber(startAngle))
            this.Start_Point = (startAngle / 180) * Math.PI;
        this.Rotation_Angle = 0;
        if (this.isValidNumber(rotationAngle))
            this.Rotation_Angle = (rotationAngle / 180) * Math.PI;
        this.reflectionPercentage = this.isValidNumber(reflectionPercentage) ? (reflectionPercentage / 100) : (0.4);
        var xPos, yPos;
        var xRadious = this.diagonal[0] / 2;
        var yRadious = this.diagonal[1] / 2;
        var centerX = xRadious;
        var centerY = yRadious;
        var EllipsePerimeter = Math.floor(Math.PI * (3 * (xRadious + yRadious) - Math.sqrt((3 * xRadious + yRadious) * (xRadious + 3 * yRadious))));
        var Temp1 = EllipsePerimeter - (EllipsePerimeter % this.items.length);
        var Temp2 = EllipsePerimeter + (this.items.length - (EllipsePerimeter % this.items.length));
        if ((EllipsePerimeter - Temp1) <= (Temp2 - EllipsePerimeter)) {
            EllipsePerimeter = Temp1;
        } else {
            EllipsePerimeter = Temp2;
        }
        for (var i = this.Start_Point; i < (this.Start_Point + 2 * Math.PI) && this.aary.length < EllipsePerimeter; i += (2 * Math.PI) / EllipsePerimeter) {
            xPos = Math.floor(centerX - (yRadious * Math.sin(i)) * Math.sin(this.Rotation_Angle) + (xRadious * Math.cos(i)) * Math.cos(this.Rotation_Angle));
            yPos = Math.floor(centerY + (xRadious * Math.cos(i)) * Math.sin(this.Rotation_Angle) + (yRadious * Math.sin(i)) * Math.cos(this.Rotation_Angle));
            this.aary.push([xPos, yPos, i, Math.sin(i) >= 0, Math.cos(i) >= 0]); //(this.aary[i][3]>0) means front elements and (this.aary[i][3]<0) means back elements
            if (circumferenceDotsColor) //draw the dots
            {
                this.parentDivDOM.appendChild(this.setStyle('DIV', {
                    position: 'absolute',
                    overflow: 'hidden',
                    left: this.aary[this.aary.length - 1][0] + 'px',
                    top: this.aary[this.aary.length - 1][1] + 'px',
                    width: '1px',
                    height: '1px',
                    backgroundColor: circumferenceDotsColor
                }));
            }
        }
        this.inc = this.aary.length;
        this.ref = 'parentDivDOM' + this.parentDivDOM.id;
        window[this.ref] = this;
        this.idOfSetTimeout = null; //This is the ID value that returned by setTimeout()
        // and will be used as the parameter for the clearTimeout() method.
        this.sizes = [];
        for (var _j = 0; _j < this.items.length; _j++) {
            // The initial positions of the objects around oval
            this.items[_j].StaticPosition = Math.floor(((this.aary.length - 1) / this.items.length) * _j);
            //Store the original size for future uses when the original size changed
            this.sizes.push([this.items[_j].offsetWidth,
                this.items[_j].offsetHeight,
                this.items[_j].style.fontSize ? parseInt(this.items[_j].style.fontSize) : null
            ]);
            this.setStyle(this.items[_j], {
                position: 'absolute',
                overflow: 'hidden'
            });
            this.setStyle(this.Reflects[_j], {
                position: 'absolute',
                border: 'none',
                overflow: 'hidden'
            });
            this.Overlay[_j].setAttribute('style', "position:absolute; border:none; overflow:hidden;" +
                "background: -moz-linear-gradient(top,  rgba(193,193,193,0.25) 0%, rgba(0,0,0,0.71) 59%, rgba(0,0,0,0.95) 90%);" +
                "background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(193,193,193,0.25)), color-stop(59%,rgba(0,0,0,0.71)), color-stop(90%,rgba(0,0,0,0.95)));" +
                "background: -webkit-linear-gradient(top,  rgba(193,193,193,0.25) 0%,rgba(0,0,0,0.71) 59%,rgba(0,0,0,0.95) 90%);" +
                "background: -o-linear-gradient(top,  rgba(193,193,193,0.25) 0%,rgba(0,0,0,0.71) 59%,rgba(0,0,0,0.95) 90%);" +
                "background: -ms-linear-gradient(top,  rgba(193,193,193,0.25) 0%,rgba(0,0,0,0.71) 59%,rgba(0,0,0,0.95) 90%);" +
                "background: linear-gradient(to bottom,  rgba(193,193,193,0.25) 0%,rgba(0,0,0,0.71) 59%,rgba(0,0,0,0.95) 90%);" +
                "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#40c1c1c1', endColorstr='#f2000000',GradientType=0 );" +
                "-ms-filter: 'progid:DXImageTransform.Microsoft.gradient (GradientType=0, startColorstr=#40c1c1c1, endColorstr=#f2000000)';");
        }
        //create svg for blur filtering in firefox
        /* //we want to create this
         <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
         <filter id="blur">
         <feGaussianBlur in="SourceGraphic" stdDeviation="0.9"/>
         </filter>
         <filter id="unblur">
         <feGaussianBlur in="SourceGraphic" stdDeviation="0"/>
         </filter>
         </svg>
         */
        if (navigator.appName !== 'Microsoft Internet Explorer') {
            var xmlns = "http://www.w3.org/2000/svg";
            var svgElem = document.createElementNS(xmlns, "svg");
            var filterElem = document.createElementNS(xmlns, "filter");
            filterElem.setAttributeNS(null, "id", "blur");
            var innerElem = document.createElementNS(xmlns, "feGaussianBlur");
            innerElem.setAttributeNS(null, "in", "SourceGraphic");
            innerElem.setAttributeNS(null, "stdDeviation", "0.9");
            filterElem.appendChild(innerElem);
            svgElem.appendChild(filterElem);
            document.querySelector('body').appendChild(svgElem);
        }
        //End of section svg creation
        this.stop = Math.floor(this.inc / this.items.length);
        // The stop point after one round moving
        this.CurrentItem = 0;
        this.items[this.CurrentItem].setAttribute('class', 'CurrentPlayedIcon');
        this.Counter = -1;
        this.RequestedIcon = null; //The icon that user like to come as the first icon
        this.position(1); //the default direction of rotation is clockwise
        // 1 = clockwise Or right to left rotation
        //-1 = unclockwise or left to right rotation
    };
    var parentDivDOM = document.getElementById(containerId);
    if (!parentDivDOM) {
        throw 'Cannot find the container in DOM. Check the containerId that you passed.';
    }
    if (!window['IRJS_Ellipse' + containerId]) {
        window['IRJS_Ellipse' + containerId] = new MJZImageRotatorJS(parentDivDOM, elementsClass, rotationSpeed, zoomPercentage, holdDelay, rotationAngle, startAngle, reflectionPercentage, circumferenceDotsColor);
        return window['IRJS_Ellipse' + containerId];
    }
    return null;
};
var IRJS_StartRotation = function(containerId, rotateDirection, holdDelay) {
    "use strict";
    if (!window['IRJS_Ellipse' + containerId]) {
        return;
    }
    window['IRJS_Ellipse' + containerId].startRotation(rotateDirection, holdDelay);
};
var IRJS_StopRotation = function(containerId) {
    "use strict";
    if (!window['IRJS_Ellipse' + containerId]) {
        return;
    }
    window['IRJS_Ellipse' + containerId].stopRotation();
};
