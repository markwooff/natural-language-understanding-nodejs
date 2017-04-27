import React from 'react';
import scrollToElement from 'scroll-to-element';
import Input from './Input.jsx';
import Output from './Output/Output.jsx';
import { analyzeWithAllFeatures } from './utils/request';

// eslint-disable-next-line
const DEFAULT_TEXT = 'All records related to the transfer of Experimental Farm lands for the Civic Campus of The Ottawa Hospital, including memos, briefing notes, impact studies and so on, and specifically information about what is grown and why it cannot be moved';
const DEFAULT_URL = 'https://api.airtable.com/v0/app4Ch9LBjHabwPrl/Imported%20table?api_key=keycUtwpJ3s8KeCOL';

export default React.createClass({
  displayName: 'Demo',

  getInitialState() {
    return {
      loading: false,
      error: null,
      data: null,
      disableButton: false,
      query: {}
    };
  },

  enableButton(event) {
    const disabled = event ? event.target.value.length < 1 : false;
    this.setState({ disableButton: disabled });
  },

  onSubmitClick(value) {
    var url = null;
    try {
      url = new URL(value);
    } catch (e) {
      // we do nothing here, because if it's not a url it doesn't matter
    }
    const query = url === null ? { text: value } : { url: value };
    this.setState({
      query,
      disableButton: true,
      loading: true,
    });

    setTimeout(() => { scrollToElement('#anchor', { duration: 300 }, 100); }, 0);

    // Send the request to NLU
    analyzeWithAllFeatures(query)
    .then(data => this.setState({ data, loading: false, error: null}))
    .catch((error) => this.setState({ error, loading: false }))
    .then(() =>
      setTimeout(() => { scrollToElement('#anchor', { duration: 300 }, 100); }, 0)
    );
  },

  render() {
    return (
      <div className="_container _container_large">
        <Input
          id="maintextarea"
          text={DEFAULT_TEXT}
          url={DEFAULT_URL}
          error={this.state.error}
          language={this.state.data ? this.state.data.results.language : null}
          disableButton={this.state.disableButton}
          onSubmit={this.onSubmitClick}
          onTabChange={this.enableButton}
          onInputChange={this.enableButton}
        />
        <div id="anchor" style={{marginTop: '0rem'}}></div>
        { !this.state.error ? (
          <Output
            loading={this.state.loading}
            data={this.state.data}
            query={this.state.query}
            language={this.state.data ? this.state.data.results.language : null}
          />) : null
        }
      </div>
    );
  }
});
