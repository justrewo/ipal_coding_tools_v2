Blockly.Blocks['robot_control_start'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/start.png",
        "width": 30,
        "height": 30,
        "alt": "start"
      }
    ],
    "nextStatement": null,
    "colour": 130,
    "tooltip": "start flag"
  });
  }
};
Blockly.Blocks['nod_head'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 点头",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/nod_head.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15
  });
  }
};

Blockly.Blocks['shake_head'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 摇头",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/shake_head.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15
  });
  }
};
Blockly.Blocks['left_head'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左转头 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/left_head.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
          "angle": 10,
          "min": 0,
          "max": 40
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15
  });
  }
};
Blockly.Blocks['right_head'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右转头 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/right_head.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
            "type": "field_angle",
            "name": "angle",
            "angle": 10,
            "min": 0,
            "max": 40
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15
  });
  }
};

Blockly.Blocks['left_upper_arm_rotate'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左大臂抬起 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/left_upper_arm_rotate.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": -25,
        "max": 175
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50
  });
  }
};

 Blockly.Blocks['left_upper_arm_roll'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左大臂摆动 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/left_upper_arm_roll.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": 0,
        "max": 65
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50
  });
  }
};
Blockly.Blocks['left_lower_arm_rotate'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左小臂旋转 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/left_lower_arm_rotate.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": -80,
        "max": 80
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50
  });
  }
};

Blockly.Blocks['left_lower_arm_roll'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左小臂摆动 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/left_lower_arm_roll.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": 0,
        "max": 90
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50
  });
  }
};

Blockly.Blocks['left_wrist_rotate'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左手腕旋转 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/left_wrist_rotate.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": -80,
        "max": 80
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50
  });
  }
};

Blockly.Blocks['right_upper_arm_rotate'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右大臂抬起 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/right_upper_arm_rotate.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": -25,
        "max": 175
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90
  });
  }
};

Blockly.Blocks['right_upper_arm_roll'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右大臂摆动 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/right_upper_arm_roll.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": 0,
        "max": 65
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90
  });
  }
};

Blockly.Blocks['right_lower_arm_rotate'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右小臂旋转 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/right_lower_arm_rotate.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": -80,
        "max": 80
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90
  });
  }
};

Blockly.Blocks['right_lower_arm_roll'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右小臂摆动 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/right_lower_arm_roll.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": 0,
        "max": 90
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90
  });
  }
};

Blockly.Blocks['right_wrist_rotate'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右手腕旋转 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/right_wrist_rotate.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": -80,
        "max": 80
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90
  });
  }
};

Blockly.Blocks['move_forward'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 前进 %2 厘米",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/move_forward.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_dropdown",
        "name": "time",
        "options": [
          [
            "50",
            "50"
          ],
          [
            "100",
            "100"
          ],
          [
            "150",
            "150"
          ],
          [
            "200",
            "200"
          ],
          [
            "250",
            "250"
          ],
          [
            "300",
            "300"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 350
  });
  }
};

Blockly.Blocks['move_backward'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 后退 %2 厘米",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/move_backward.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_dropdown",
        "name": "time",
        "options": [
          [
            "50",
            "50"
          ],
          [
            "100",
            "100"
          ],
          [
            "150",
            "150"
          ],
          [
            "200",
            "200"
          ],
          [
            "250",
            "250"
          ],
          [
            "300",
            "300"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 350
  });
  }
};

Blockly.Blocks['move_turn_left'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 左转 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/move_turn_left.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": 0,
        "max": 180
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 350
  });
  }
};

Blockly.Blocks['move_turn_right'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 右转 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/move_turn_right.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_angle",
        "name": "angle",
        "angle": 10,
        "min": 0,
        "max": 180
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 350
  });
  }
};

Blockly.Blocks['emotion_smile'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 微笑",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_smile.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};

Blockly.Blocks['emotion_laugh'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 大笑",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_laugh.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};

Blockly.Blocks['emotion_sad'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 悲伤",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_sad.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};

Blockly.Blocks['emotion_cry'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 哭泣",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_cry.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};

Blockly.Blocks['emotion_angry'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 生气",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_angry.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};

Blockly.Blocks['emotion_amazed'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 惊讶",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_amazed.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};
Blockly.Blocks['emotion_shy'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 害羞",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_shy.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};
Blockly.Blocks['emotion_doubt'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 怀疑",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/emotion_doubt.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  });
  }
};

Blockly.Blocks['action_handshake'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 握手",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_handshake.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_wavehand'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 挥手",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_wavehand.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

 Blockly.Blocks['action_cheer'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 欢呼",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_cheer.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_embrace'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 拥抱",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_embrace.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_rubeye'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 揉眼睛",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_rubeye.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_shutup'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 制止说话",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_shutup.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_donottouchme'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 不要碰我",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_donottouchme.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_dance'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 跳芭蕾",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_dance.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

Blockly.Blocks['action_turnpage'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 翻书",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_turnpage.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};
Blockly.Blocks['action_takephoto'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 双手拍照",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_takephoto.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

  Blockly.Blocks['action_toweling'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 擦汗",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_toweling.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

  Blockly.Blocks['action_upgrade'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 升级",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/action_upgrade.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  });
  }
};

  Blockly.Blocks['speak'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/speak.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_dropdown",
        "name": "speakContent",
        "options": [
          [
            "hello",
            "hello"
          ],
          [
            "生日快乐",
            "生日快乐"
          ],
          [
            "great",
            "great"
          ],
          [
            "动画片",
            "动画片"
          ],
          [
            "wow",
            "wow"
          ],
          [
            "yoho",
            "yoho"
          ],
          [
            "biubiu",
            "biubiu"
          ],
          [
            "早上好",
            "早上好"
          ],
          [
            "啊哦",
            "啊哦"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 260
  });
  }
};

Blockly.Blocks['background_music'] = {
  init: function() {
    var aaa = this;
      $.ajax({'url':'../media',
          'data':{},
          'success':function(data){
              console.log(data.value);
              var options = data.value;
              var optionjson = [];
              for (var i = 0; i< options.length; i++)
              {
                var temp = [];
                var index = options[i].lastIndexOf(".");
                if (index > 0) {
                    var substr = options[i].substring(0, index);
                    if (index >= 6)
                    {
                      substr = substr.substring(0, 6) + '...';
                    }

                    temp.push(substr);
                }else{
                    temp.push(options[i]);
                }
                temp.push(options[i]);
                optionjson.push(temp);
              }
              console.log(optionjson);

              aaa.jsonInit({
                  "message0": "%1 %2 %3 %4",
                  "args0": [
                      {
                          "type": "field_image",
                          "src": "assets/imgs/background_music.png",
                          "width": 30,
                          "height": 30,
                          "alt": "*"
                      },
                      {
                          "type": "field_dropdown",
                          "name": "musicList",
                          "options": optionjson
                      },
                      {
                          "type": "input_dummy"
                      },
                      {
                          "type": "input_statement",
                          "name": "actionList"
                      }
                  ],
                  "previousStatement": null,
                  "nextStatement": null,
                  "colour": 260,
                  "tooltip": "",
                  "helpUrl": "http://www.example.com/"
              });
             },
          'error':function(data){
              console.log(data.value);
              var options = data.value;

              aaa.jsonInit({
                  "message0": "%1 %2 %3 %4",
                  "args0": [
                      {
                          "type": "field_image",
                          "src": "assets/imgs/background_music.png",
                          "width": 30,
                          "height": 30,
                          "alt": "*"
                      },
                      {
                          "type": "field_dropdown",
                          "name": "musicList",
                          "options": [
                              [
                                  "no music",
                                  "no music"
                              ]
                          ]
                      },
                      {
                          "type": "input_dummy"
                      },
                      {
                          "type": "input_statement",
                          "name": "actionList"
                      }
                  ],
                  "previousStatement": null,
                  "nextStatement": null,
                  "colour": 260,
                  "tooltip": "",
                  "helpUrl": "http://www.example.com/"
              });
          },
          'type':'get',
          'dataType':'json',
          'async': false});
  }
};

Blockly.Blocks['speak_record'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/imgs/record.png",
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "field_imagebutton",
        "name": "recordsrc",
        "src": "assets/imgs/recordstart.png",
        "width": 90,
        "height": 30,
        "alt": "*"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 260
  });
  }
};
 Blockly.Blocks['control_loop'] = {
  init: function() {
    this.jsonInit({
    "message0": "循环 %1 次 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "loopCount",
        "options": [
          [
            "1",
            "1"
          ],
          [
            "2",
            "2"
          ],
          [
            "3",
            "3"
          ],
          [
            "4",
            "4"
          ],
          [
            "5",
            "5"
          ],
          [
            "6",
            "6"
          ],
          [
            "7",
            "7"
          ],
          [
            "8",
            "8"
          ]
        ]
      },
      {
        "type": "input_statement",
        "name": "actionsList"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300
    });
  }
};
 Blockly.Blocks['control_simultaneously'] = {
  init: function() {
    this.jsonInit({
    "message0": "同时 %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "actionsList"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300
    });
  }
};

Blockly.Blocks['action_reset'] = {
  init: function() {
    this.jsonInit({
    "message0": "动作复位",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300
    });
  }
};

Blockly.Blocks['control_variables_get'] = {
  init: function() {
    this.jsonInit({
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "varname",
        "options": [
          [
            "变量1",
            "variable1"
          ],
          [
            "变量2",
            "variable2"
          ],
          [
            "变量3",
            "variable3"
          ],
          [
            "变量4",
            "variable4"
          ],
          [
            "变量5",
            "variable5"
          ],
          [
            "变量6",
            "variable6"
          ],
          [
            "变量7",
            "variable7"
          ],
          [
            "变量8",
            "variable8"
          ],
          [
            "变量9",
            "variable9"
          ],
          [
            "变量10",
            "variable10"
          ]
        ]
      },
    ],
    "inputsInline": true,
    "output": null,
    "tooltip": "",
    "colour": 300,
    "helpUrl": "http://www.example.com/"
    });
  }
};

Blockly.Blocks['control_variables_set'] = {
  init: function() {
    this.jsonInit({
      "message0": "赋值 %1 到 %2",
      "args0": [
      {
        "type": "field_dropdown",
        "name": "varname",
        "options": [
          [
            "变量1",
            "variable1"
          ],
          [
            "变量2",
            "variable2"
          ],
          [
            "变量3",
            "variable3"
          ],
          [
            "变量4",
            "variable4"
          ],
          [
            "变量5",
            "variable5"
          ],
          [
            "变量6",
            "variable6"
          ],
          [
            "变量7",
            "variable7"
          ],
          [
            "变量8",
            "variable8"
          ],
          [
            "变量9",
            "variable9"
          ],
          [
            "变量10",
            "variable10"
          ]
        ]
      },
      {
        "type": "input_value",
        "name": "varvalue",
      }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "",
    "colour": 300,
    "helpUrl": "http://www.example.com/"
    });
  }
};

Blockly.Blocks['control_functions'] = {
    init: function() {
        var length = localStorage.length;
        var optionJson = [];
        for (var i=0; i<length; i++)
        {
            var keyValue = localStorage.key(i);
            if (keyValue.indexOf("subfunc") == 0)
            {
                var fun = [];
                //var name = keyValue.replace("subfunc", "子程序");
                var objects = JSON.parse(localStorage[keyValue]);
                var name = objects[0];
                fun.push(name);
                fun.push(keyValue);
                optionJson.push(fun);
            }
        }
        if (optionJson.length == 0)
        {
          var tmp = ["no function", "no function"]
            optionJson.push(tmp);
        }

        this.jsonInit({
            "message0": "子程序 %1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "functionName",
                    "options": optionJson
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 260,
            "tooltip": "",
            "helpUrl": "http://www.example.com/"
        });
    }
};
