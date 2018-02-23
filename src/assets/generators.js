/*
 *  Copyright 2015 Google Inc. All Rights Reserved.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview Generators for the Turtle Blockly demo on Android.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

// Extensions to Blockly's language and JavaScript generator.
var loopCount = 0;


/**
 * The generated code for turtle blocks includes block ID strings.  These are useful for
 * highlighting the currently running block, but that behaviour is not supported in Android Blockly
 * as of May 2016.  This snippet generates the block code normally, then strips out the block IDs
 * for readability when displaying the code to the user.
 *
 * Post-processing the block code in this way allows us to use the same generators for the Android
 * and web versions of the turtle.
 */

Blockly.JavaScript['robot_control_start'] = function(block) {
  var code = 'var variable1, variable2, variable3, variable4, variable5,variable6, variable7, variable8, variable9, variable10;\n';
  return code;
};

Blockly.JavaScript['nod_head'] = function(block) {
  //var dropdown_nodcount = block.getFieldValue('nodCount');
  // TODO: Assemble JavaScript into code variable.
  return '{\n call("nod_head","");\n}\n';
};

Blockly.JavaScript['shake_head'] = function(block) {
  //var dropdown_shakecount = block.getFieldValue('shakeCount');
  // TODO: Assemble JavaScript into code variable.
  return '{\n call("shake_head","");\n}\n';
};

Blockly.JavaScript['left_head'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  return '{\n call("left_head","' + dropdown_angle + '");\n}\n';
};

Blockly.JavaScript['right_head'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("right_head","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['left_upper_arm_rotate'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("left_upper_arm_rotate","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['left_upper_arm_roll'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("left_upper_arm_roll","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['left_lower_arm_rotate'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("left_lower_arm_rotate","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['left_lower_arm_roll'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("left_lower_arm_roll","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['left_wrist_rotate'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("left_wrist_rotate","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['right_upper_arm_rotate'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("right_upper_arm_rotate","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['right_upper_arm_roll'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("rightupper_arm_roll","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['right_lower_arm_rotate'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("right_lower_arm_rotate","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['right_lower_arm_roll'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("right_lower_arm_roll","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['right_wrist_rotate'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("right_wrist_rotate","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['move_forward'] = function(block) {
  var dropdown_time = block.getFieldValue('time');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("move_forward","' + dropdown_time + '");\n}\n';
  return code;
};

Blockly.JavaScript['move_backward'] = function(block) {
  var dropdown_time = block.getFieldValue('time');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("move_backward","' + dropdown_time + '");\n}\n';
  return code;
};

Blockly.JavaScript['move_turn_left'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("move_turn_left","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['move_turn_right'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("move_turn_right","' + dropdown_angle + '");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_smile'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_smile","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_laugh'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_laugh","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_sad'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_sad","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_cry'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_cry","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_angry'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_angry","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_amazed'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_amazed","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_shy'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_shy","");\n}\n';
  return code;
};

Blockly.JavaScript['emotion_doubt'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("emotion_doubt","");\n}\n';
  return code;
};

Blockly.JavaScript['action_handshake'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_handshake","");\n}\n';
  return code;
};

Blockly.JavaScript['action_wavehand'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_wavehand","");\n}\n';
  return code;
};

Blockly.JavaScript['action_cheer'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_cheer","");\n}\n';
  return code;
};

Blockly.JavaScript['action_embrace'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_embrace","");\n}\n';
  return code;
};

Blockly.JavaScript['action_blowkiss'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_blowkiss","");\n}\n';
  return code;
};

Blockly.JavaScript['action_rubeye'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_rubeye","");\n}\n';
  return code;
};

Blockly.JavaScript['action_shutup'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_shutup","");\n}\n';
  return code;
};

Blockly.JavaScript['action_donottouchme'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_donottouchme","");\n}\n';
  return code;
};

Blockly.JavaScript['action_dance'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_dance","");\n}\n';
  return code;
};

Blockly.JavaScript['action_turnpage'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_turnpage","");\n}\n';
  return code;
};

Blockly.JavaScript['action_takephoto'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_takephoto","");\n}\n';
  return code;
};

Blockly.JavaScript['action_toweling'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_toweling","");\n}\n';
  return code;
};

Blockly.JavaScript['action_upgrade'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n call("action_upgrade","");\n}\n';
  return code;
};

Blockly.JavaScript['speak'] = function(block) {
  var dropdown_speakcontent = block.getFieldValue('speakContent');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n say(\"' + dropdown_speakcontent + '\");\n}\n';
  return code;
};

Blockly.JavaScript['background_music'] = function(block) {
  var dropdown_musiclist = block.getFieldValue('musicList');
  var statements_actionlist = Blockly.JavaScript.statementToCode(block, 'actionList');
  // TODO: Assemble JavaScript into code variable.
  var code = 'music(\"'+ dropdown_musiclist + '\") {\n'+ statements_actionlist + '}\n';
  return code;
};

Blockly.JavaScript['speak_record'] = function(block) {
  var record_src = block.getFieldValue('recordsrc');
  // TODO: Assemble JavaScript into code variable.
  var code = '{\n play(\"'+ record_src + '\");\n}\n';
    return code;
};

Blockly.JavaScript['control_loop'] = function(block) {
  var dropdown_loopcount = block.getFieldValue('loopCount');
  var statements_actionslist = Blockly.JavaScript.statementToCode(block, 'actionsList');
  // TODO: Assemble JavaScript into code variable.
  var code = 'for (var count'+ loopCount+ '=0; count' +loopCount + '<'+ dropdown_loopcount+ '; count' +loopCount +'++){\n' + statements_actionslist + '}\n';
  loopCount++;
  return code;
};

Blockly.JavaScript['control_simultaneously'] = function(block) {
  var statements_actionslist = Blockly.JavaScript.statementToCode(block, 'actionsList');
  // TODO: Assemble JavaScript into code variable.
  var code = 'parallel{\n'+ statements_actionslist + '}\n'
  return code;
};

Blockly.JavaScript['control_variables_get'] = function(block) {
    var dropdown_varname = block.getFieldValue('varname');
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_varname;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code,Blockly.JavaScript.ORDER_ATOMIC];
    //return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['control_variables_set'] = function(block) {
    var dropdown_variablename = block.getFieldValue('varname');
    var value_variableset = Blockly.JavaScript.valueToCode(block, 'varvalue', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = dropdown_variablename + ' = ' + value_variableset + ';\n';
    return code;
};

Blockly.JavaScript['control_functions'] = function(block) {
    var dropdown_functionname = block.getFieldValue('functionName');
    var code ='';
    if (dropdown_functionname.indexOf("subfunc")==0) {
        code = dropdown_functionname + '();\n';
    }

    return code;
};
