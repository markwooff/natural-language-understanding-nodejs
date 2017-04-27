import React from 'react';
import lang from 'language-list';
import { parser } from 'css-math';
import { StyleSheet, css } from 'aphrodite/no-important';
import ErrorMessage from './ErrorMessage.jsx';
import { Tabs, Pane } from 'watson-react-components';
import { colors } from './utils/colors';
import { weight, size } from './utils/typography';
import { breakpoint } from './utils/breakpoints';
import { MAX_CONTENT_WIDTH } from './utils/variables';

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keycUtwpJ3s8KeCOL'}).base('app4Ch9LBjHabwPrl');

let languages = lang();
let index = 0;
let currentInput;
const buttonBreakpoint = '400px';

const styles = StyleSheet.create({
  container: {
    maxWidth: parser(`${MAX_CONTENT_WIDTH} - 1rem`),
  },
  header: {
    marginTop: '6rem',
    marginBottom: '2rem',
    color: colors.PRIMARY,
    fontWeight: weight.NORMAL,
  },
  textarea: {
    border: 'none',
    borderWidth: '1px',
    padding: '0rem',
    resize: 'none',
    height: '6rem',
    ':focus': {
      border: 'none',
      outline: 'none',
    }
  },
  buttonContainer: {
    display: 'block',
    marginTop: '2rem',
    marginBottom: '3rem',
    [breakpoint(buttonBreakpoint)]: {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-start',
    },
  },
  button: {
    padding: '0.2em 3em',
    fontWeight: weight.NORMAL,
    width: '100%',
    marginBottom: '2rem',
    [breakpoint(buttonBreakpoint)]: {
      width: 'auto',
      margin: '0rem 1rem 0rem 0rem',
    },
    ':disabled': {
      backgroundColor: colors.LIGHT_GRAY,
      borderColor: colors.LIGHT_GRAY,
    },
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 10rem)',
    marginTop: '0rem',
  },
  footnote: {
    fontSize: size.SMALL,
  },
  language: {
    fontSize: size.SMALL,
    float: 'right',
    marginLeft: '3rem',
    fontStyle: 'italic',
  },
});

const Input = React.createClass({
  displayName: 'Input',

  propTypes: {
    text: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    language: React.PropTypes.string,
    disableButton: React.PropTypes.bool,
    onSubmit: React.PropTypes.func,
    onTabChange: React.PropTypes.func,
    onInputChange: React.PropTypes.func,
    error: React.PropTypes.shape({
      error: React.PropTypes.string,
      code: React.PropTypes.number,
    }),
  },

  getDefaultProps() {
    return {
      onSubmit() {},
      onTabChange() {},
      onInputChange() {},
      disableButton: false,
    };
  },

  getInitialState() {
    return {
      text: this.props.text,
      url: this.props.url,
      rowcontent: this.props.rowcontent
    };
  },

  componentDidMount() {
    var parent = this;
    var content = "";

    base('Imported table').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 5,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
            content += record.get('summary_en') + "\n---\n";
        });
        
        parent.setState({ rowcontent: content });
        
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
  },

  onAnalyzeClick() {
    currentInput = index === 0 ? this.state.text : (index === 1 ? this.state.url : this.state.rowcontent);
    this.props.onSubmit(currentInput);
  },
  
  render() {
    return (
      <div className={css(styles.container)}>
        <h3 className={css(styles.header)}>Examine a news article or other content</h3>
        <Tabs selected={index} onChange={(i) => {
          index = i;
          this.props.onTabChange.call(this);
        }}>
          <Pane label="Text">
            {/* hack to render textarea properly */}
            <div style={{visibility:'hidden', margin: '0rem 0rem -1rem', height: '0rem', overflow: 'hidden'}}></div>
            <textarea className={css(styles.textarea)} defaultValue={this.state.text} rows="7" onChange={(e) => {
              this.setState({ text: e.target.value });
              this.props.onInputChange.call(this,e);
            }} />
          </Pane>
          <Pane label="URL">
            <textarea className={css(styles.textarea)} defaultValue={this.state.url} onChange={(e) => {
              this.setState({ url: e.target.value });
              this.props.onInputChange.call(this,e);
            }} />
          </Pane>
          <Pane label="Airtable">
            <div style={{visibility:'hidden', margin: '0rem 0rem -1rem', height: '0rem', overflow: 'hidden'}}></div>
            <textarea className={css(styles.textarea)} defaultValue={this.state.rowcontent} rows="7" onChange={(e) => {
              this.setState({ rowcontent: e.target.value });
              this.props.onInputChange.call(this,e);
            }} />
          </Pane>
        </Tabs>
        <p style={{visibility: this.props.language ? 'visible' : 'hidden' }}
           className={css(styles.language)}>{this.props.language ? languages.getLanguageName(this.props.language) : null}</p>
        <p className={css(styles.footnote)}>For results unique to your business needs consider building a <a href="https://www.ibm.com/us-en/marketplace/supervised-machine-learning" target="_blank">custom model</a>.</p>
        <div className={css(styles.buttonContainer)}>
          <button
            disabled={this.props.disableButton}
            className={`base--button_fill ${css(styles.button)}`}
            onClick={this.onAnalyzeClick}>
              Analyze
          </button>
          {this.props.error ? <ErrorMessage error={this.props.error}/> : null}
        </div>
      </div>
    );
  }
});

export default Input;
