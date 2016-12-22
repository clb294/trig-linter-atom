'use babel';
import { CompositeDisposable } from 'atom';

import * as helpers from  'atom-linter';
import * as trigParser from 'js-trig-parser';


export default {

  subscriptions: null,

  activate(state) {

    require('atom-package-deps').install('trig-linter-atom')
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
   
  },

  deactivate() {
    // this.modalPanel.destroy();
    this.subscriptions.dispose();
    // this.trigLinterView.destroy();
  },




  provideLinter() {


    return {
      name: "TrigLinter",
      grammarScopes : ['source.trig','source.trtl','source.turtle'],
      scope: 'file',
      lintOnFly: true,
      gutterEnabled: true,
      underlineIssues: true,
      lintOnFlyInterval: 1500,
      showErrorPanel:true,
      showErrorInline:true,
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();
        const text = textEditor.getText();


        if (text.length === 0) {
          return Promise.resolve([]);
        }

        return new Promise(function(resolve, reject){
            setTimeout(function(){
              reject('Timeout on lint of : ' + filePath);
            },5000);

            var results = trigParser.loaders.graphLoader.fromString(text);
            var syntaxErrors = results.syntaxErrors.map(function(se){
              console.log('syntaxErrors')
              console.log(se)
                var line = se.line - 1;
                var col = se.column;
                return {
                  type: 'Error',
                  text: se.msg, filePath,
                  range: helpers.rangeFromLineNumber(textEditor, line, col)
                };
            });

            var analysisErrors = results.analysisErrors.map(function(se){

                var line = se.line - 1;
                var col = se.column;
                var len = se.len || (se.start ? se.start.stop - se.start.start: 1);
                var range = [[line,col],[line, col + len]];
                return {
                  type: 'Warning',
                  text: se.message , filePath,
                  range: range
                };
            });
            var errors = results.errors.map(function(se){
                console.log('error')
                console.log(se)
                var line = se.symbol.line - 1;
                var col = se.symbol.column;
                var len = se.len || (se.symbolstart ? se.start.symbol.stop - se.symbol.start.start: 1);
                var range = [[line,col],[line, col + len]]
                return {
                    type: 'Error',
                    text: se.symbol._text, filePath,
                    range: range
                };
            });

            var allErrors = errors.concat(syntaxErrors).concat(analysisErrors).filter(function(m){
              if(!m.text){
                console.error("error without text");
                console.error(m);
              }
              return m.text;
            });
            console.log(allErrors);
            resolve(allErrors);
        });



      }
    }
  }
};
