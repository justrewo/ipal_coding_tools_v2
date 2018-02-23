/**
 * Created by zhengtang on 16-12-30.
 */
/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Image field.  Used for titles, labels, etc.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldImageButton');

goog.require('Blockly.FieldImage');
goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('goog.userAgent');




/**
 * Class for an image.
 * @param {string} src The URL of the image.
 * @param {number} width Width of the image.
 * @param {number} height Height of the image.
 * @param {string=} opt_alt Optional alt text for when block is collapsed.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldImageButton = function(src, width, height, opt_alt) {

    Blockly.FieldImageButton.superClass_.constructor.call(this, src, width, height, opt_alt);

};
goog.inherits(Blockly.FieldImageButton, Blockly.FieldImage);

/**
 * Rectangular mask used by Firefox.
 * @type {Element}
 * @private
 */
Blockly.FieldImageButton.prototype.rectElement_ = null;

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
Blockly.FieldImageButton.prototype.EDITABLE = true;



/**
 * Install this image on a block.
 */
Blockly.FieldImageButton.prototype.init = function() {
    if (this.fieldGroup_) {
        // Image has already been initialized once.
        return;
    }
    // Build the DOM.
    /** @type {SVGElement} */
    this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
    if (!this.visible_) {
        this.fieldGroup_.style.display = 'none';
    }
    /** @type {SVGElement} */
    this.imageElement_ = Blockly.utils.createSvgElement('image',
        {'height': this.height_ + 'px',
            'width': this.width_ + 'px'}, this.fieldGroup_);
    this.setValue(this.src_);
    if (goog.userAgent.GECKO) {
        /**
         * Due to a Firefox bug which eats mouse events on image elements,
         * a transparent rectangle needs to be placed on top of the image.
         * @type {SVGElement}
         */
        this.rectElement_ = Blockly.utils.createSvgElement('rect',
            {'height': this.height_ + 'px',
                'width': this.width_ + 'px',
                'fill-opacity': 0}, this.fieldGroup_);
    }
    this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);


    // Configure the field to be transparent with respect to tooltips.
    var topElement = this.rectElement_ || this.imageElement_;
    topElement.tooltip = this.sourceBlock_;
    Blockly.Tooltip.bindMouseEvents(topElement);

    this.clickWrapper_ =
        Blockly.bindEventWithChecks_(this.fieldGroup_, 'mouseup', this, this.onClick);
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
Blockly.FieldImageButton.prototype.dispose = function() {
    goog.dom.removeNode(this.fieldGroup_);
    this.fieldGroup_ = null;
    this.imageElement_ = null;
    this.rectElement_ = null;
    if (this.clickWrapper_) {
        Blockly.unbindEvent_(this.clickWrapper_);
    }
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
Blockly.FieldImageButton.prototype.setTooltip = function(newTip) {
    var topElement = this.rectElement_ || this.imageElement_;
    topElement.tooltip = newTip;
};

/**
 * Get the source URL of this image.
 * @return {string} Current text.
 * @override
 */
Blockly.FieldImageButton.prototype.getValue = function() {
    return this.src_;
};

/**
 * Set the source URL of this image.
 * @param {?string} src New source.
 * @override
 */
Blockly.FieldImageButton.prototype.setValue = function(src) {
    if (src != null) {
        this.src_ = src;
    }

    if (this.imageElement_) {
        //this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        //    'xlink:href', goog.isString(src) ? src : '');
        switch(this.imageclickstatus)
        {
            case 1:
                this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
                    'xlink:href',"assets/blockly/images/recordstop.png");
                break;

            case 2:
                console.log("set value to recordplay");
                this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
                    'xlink:href',"assets/blockly/images/recordplay.png");
                break;

            default:
                this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
                    'xlink:href',"assets/blockly/images/recordstart.png");
                break;
        }

    }
};

/**
 * Set the alt text of this image.
 * @param {?string} alt New alt text.
 * @override
 */
Blockly.FieldImageButton.prototype.setText = function(alt) {
    if (alt === null) {
        // No change if null.
        return;
    }
    this.text_ = alt;
};

/**
 * Images are fixed width, no need to render.
 * @private
 */
Blockly.FieldImageButton.prototype.render_ = function() {
    // NOP
};


Blockly.FieldImageButton.prototype.imageclickstatus = 0;


Blockly.FieldImageButton.prototype.audioPath = null;
Blockly.FieldImageButton.prototype.timer = null;
/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldImageButton.prototype.onClick = function(e) {
    if (this.sourceBlock_.isInFlyout)
    {
        return;
    }
   switch(this.imageclickstatus)
    {
       case 0:
            console.log("start recordclick");
            if (window.android) {
                this.audioPath = window.android.startRecord();
                console.log(this.audioPath);
                if (this.audioPath != null)
                {
                    this.imageclickstatus = 1;
                    this.setValue();
                    this.timer =  window.setTimeout(_stopRecord(this),10*1000);
                }
            } else if (window.WebViewJavascriptBridge) {//iPhone,启动录音界面
                window.WebViewJavascriptBridge.callHandler("audioRecordStart");
                this.imageclickstatus = 1;
                this.setValue();
            } else {
                var res = soaros_recorder_start();
                if (res == 0) {
                    this.imageclickstatus = 1;
                    this.setValue();
                    this.timer =  window.setTimeout(_stopRecord(this),10*1000);
                }
            }
            break;

       case 1:
           console.log("stop record click");
           stopRecord(this);
           break;

       case 2:
           console.log("play record click");
           if (window.android) {
               window.android.playRecord(this.audioPath);
           } else if (window.WebViewJavascriptBridge) {//iPhone
               window.WebViewJavascriptBridge.callHandler("AudioPlay",this.audioPath);
           } else {
               soaros_recorder_play();
           }
           break;

       default:
           break;
    }
};


function stopRecord(e){
    window.clearTimeout(e.timer);
    e.imageclickstatus = 2;
    e.setValue();

    console.log("stop record");
    if (window.android) {
        window.android.stopRecord();
        var hash = window.android.uploadFile(e.audioPath);
        e.setValue(hash);
    } else if (window.WebViewJavascriptBridge) {//iPhone,停止录音
        window.WebViewJavascriptBridge.callHandler("audioRecordStop",null,
            function responseCallback(responseData) {
                var AudioPath = responseData;
                 e.audioPath = AudioPath;
                //上传音频文件
                window.WebViewJavascriptBridge.callHandler("uploadFile",AudioPath,
                function callback (respData) {
                    e.setValue(respData);
                });
            });

    } else {
        var res = soaros_recorder_stop(e);
    }
}
//创建一个函数,用于返回一个无参数函数
function _stopRecord(_name){
    return function(){
        stopRecord(_name);
    }
}
