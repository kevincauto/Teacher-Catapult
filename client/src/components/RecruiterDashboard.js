import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import getTodaysDate from '../utils/getTodaysDate';
import CheckBoxes from './SubmitResumeCheckBoxes';
import RecruiterSidebar from './RecruiterSidebar';

const CERTIFICATIONS = [
  'Agriculture',
  'Art',
  'Autistic Support',
  'Behavior Specialist',
  'Business',
  'Computer Information Tech',
  'Citizenship',
  'Communications',
  'Cooperative Education',
  'Driver',
  'Early Childhood',
  'Elementary',
  'Emotional Support',
  'English',
  'English as a Second Language',
  'Environmental Education',
  'Family Consumer Science',
  'Foreign Language - Chinese',
  'Foreign Language - French',
  'Foreign Language - German',
  'Foreign Language - Hebrew',
  'Foreign Language - Italian',
  'Foreign Language - Japanese',
  'Foreign Language - Latin',
  'Foreign Language - Other',
  'Foreign Language - Spanish',
  'Gifted',
  'Guidance Counselor',
  'Health',
  'Language Arts',
  'Library Science',
  'Marketing',
  'Mathematics',
  'Music',
  'Psychologist',
  'Physical Education',
  'Principal',
  'Reading Specialist',
  'Science',
  'Social Studies',
  'Special Education',
  'Special Education - Hearing Impaired',
  'Special Education - Speech and Language',
  'Special Education - Visually Impaired',
  'Stem',
  'Superintendent',
  'Technology Education',
  'Theater',
  'Tutoring',
  'Vocational Instruction'
];

class RecruiterDashboard extends Component {
  constructor() {
    super();
    this.state = {
      filterCertification: '',
      zipcode: '',
      showZipcodeWarning: false
    };

    this.handleZipcodeSearch = this.handleZipcodeSearch.bind(this);
  }
  componentDidUpdate() {

  }
  handleZipcodeSearch() {
    if (/^\d{5}$/.test(this.state.zipcode)) {
      //commence zipcode search
    } else {
      this.setState({ showZipcodeWarning: true });
    }
  }

  handleZipcodeChange(e) {
    let value = e.target.value;
    if (value.length > 5 || !/^\d+$/.test(value)) {
      this.setState({ showZipcodeWarning: true });
    } else {
      this.setState({ showZipcodeWarning: false });
    }

    this.setState({ zipcode: e.target.value });
  }
  renderWarning() {
    if (this.state.showZipcodeWarning === true) {
      return (
        <div className="alert alert-danger" role="alert">
          <span
            className="glyphicon glyphicon-exclamation-sign"
            aria-hidden="true"
          />
          <span class="sr-only">Error:</span>
          &nbsp;Please enter a valid zipcode
        </div>
      );
    }
    return;
  }

  handleFilterCertification(e) {
    this.setState({ filterCertification: e.target.value });
  }

  renderCertificationDropdown() {
    return (
      // input-group-lg
      <div className="">
        <select
          className="form-control"
          placeholder="Certification"
          value={this.state.certification}
          name="certification"
          onChange={e => this.handleFilterCertification(e)}
        >
          <option placeholder="Certification">Any Certification</option>
          {CERTIFICATIONS.map(cert => {
            return (
              <option key={cert} value={cert}>
                {cert}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  renderTable(leads = [], userleads = []) {
    leads = leads.filter(lead => {
      //make certifications a string with commas
      let certifications = lead.certifications
        .reduce((prev, curr) => {
          if (prev === '') {
            return curr;
          }
          return prev + ', ' + curr;
        }, '')
        .toLowerCase();

      //

      if (
        certifications.indexOf(this.state.filterCertification.toLowerCase()) !==
        -1
      ) {
        return true;
      }
      return false;
    });

    leads = leads.map((lead, i) => {
      let {
        first,
        last,
        certifications,
        lastUpdated,
        email,
        relocate,
        resume,
        startDate,
        city,
        state,
        zipcode
      } = lead;

      certifications = certifications.reduce((prev, curr) => {
        if (prev === '') {
          return curr;
        }
        return prev + ', ' + curr;
      }, '');

      return (
        <tr key={i}>
          <td>
            <div className="row">
              <div className="col-sm-4">
                <strong>
                  {first} {last}
                </strong>
                <br />
                Last Updated: {lastUpdated}
                <br />
                {email}
                <br />
              </div>
              <div className="col-sm-3">
                {`${city}, ${state}`} <br />
                Cert Date: {startDate} <br />
                <a href={resume} target="_blank" rel="nofollow">
                  View Resume
                </a>
              </div>
              <div className="col-sm-5">
                <strong>Certifications:</strong>
                <br />
                {certifications}
              </div>
            </div>
          </td>
        </tr>
      );
    });
    userleads = userleads.filter(lead => {
      //make certifications a string with commas
      // let str = JSON.parse(lead.resume);

      let certifications = lead.certifications
        .reduce((prev, curr) => {
          if (prev === '') {
            return curr;
          }
          return prev + ', ' + curr;
        }, '')
        .toLowerCase();

      //
      let first = lead.first.toLowerCase();
      if (
        certifications.indexOf(this.state.filterCertification.toLowerCase()) !==
        -1
      ) {
        return true;
      }
      return false;
    });

    userleads = userleads.map((lead, i) => {
      let {
        first,
        last,
        certifications,
        lastUpdated,
        email,
        relocate,
        // resume,
        startDate,
        city,
        state,
        zipcode
      } = lead;

      certifications = certifications.join(', ');

      return (
        <tr key={i + 'ul'}>
          <td>
            <div className="row">
              <div className="col-sm-4">
                <strong>
                  {first} {last}
                </strong>
                <br />
                Last Updated: {lastUpdated}
                <br />
                {email}
                <br />
              </div>
              <div className="col-sm-3">
                {`${city}, ${state}`} <br />
                Cert Date: {startDate} <br />
              </div>
              <div className="col-sm-5">
                <strong>Certifications:</strong>
                <br />
                {certifications}
              </div>
            </div>
          </td>
        </tr>
      );
    });

    userleads.push(leads);
    return userleads;
  }

  renderWithLeadPermission() {
    let today = getTodaysDate();
    return (
      <div className="col-md-8 col-lg-9">
        <center>
          <h2>Your Dashboard {today}</h2>
        </center>
        <h3>Search for teachers by certification, close to your zipcode.</h3>
        <div className="row">
          <div className="col-sm-6">{this.renderCertificationDropdown()}</div>
          <div className="col-sm-6">
            <div className="input-group job-form">
              <input
                type="text"
                className="form-control"
                placeholder="Zipcode"
                aria-describedby="sizing-addon1"
                name={'zipcode'}
                value={this.state.zipcode}
                onChange={e => this.handleZipcodeChange(e)}
              />
              <span className="input-group-btn">
                <button
                  onClick={this.handleZipcodeSearch}
                  className="btn btn-default"
                  type="button"
                >
                  <span className="glyphicon glyphicon-search" />
                </button>
              </span>
            </div>

            {this.renderWarning()}
          </div>
        </div>
        <br />

        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th className="position">Teacher Candidates</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTable(this.props.leads, this.props.userleads)}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    let today = getTodaysDate();
    if (this.props.auth == null) {
      return (
        <div className="container">
          <img
            src="../../img/mountain-background.jpeg"
            alt="bg"
            className="bg"
          />
          <img
            src="http://placehold.it/468x60/eee"
            className="masthead"
            alt="half masthead ad"
          />
          <br />
          <br />
          <div className="content-container container">
            <div className="row">
              <div className="col-md-8 col-lg-9">
                <h2>Loading...</h2>
              </div>
              <RecruiterSidebar />
            </div>
          </div>
        </div>
      );
    }

    if (!this.props.auth.leadPermission) {
      return (
        <div className="container">
          <img
            src="../../img/mountain-background.jpeg"
            alt="bg"
            className="bg"
          />
          <img
            src="http://placehold.it/468x60/eee"
            className="masthead"
            alt="half masthead ad"
          />
          <br />
          <br />
          <div className="content-container container">
            <div className="row">
              <div className="col-md-8 col-lg-9">
                <h1>Welcome!</h1>
                <h2>Your Dashboard {today}</h2>
                You currently do not have permission to access teacher resume
                data. We will contact you shortly after registering. In the
                meantime, you have the ability to post jobs{' '}
                <a href="/job-post">HERE</a>.
              </div>
              <RecruiterSidebar />
            </div>
          </div>
        </div>
      );
    }

    if (this.props.auth.leadPermission) {
      return (
        <div className="container">
          <img
            src="../../img/mountain-background.jpeg"
            alt="bg"
            className="bg"
          />
          <img
            src="http://placehold.it/468x60/eee"
            className="masthead"
            alt="half masthead ad"
          />
          <br />
          <br />
          <div className="content-container container">
            <div className="row">
              {this.renderWithLeadPermission()}
              <RecruiterSidebar />
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps({ leads, userleads, auth }) {
  if (leads && userleads && auth) {
    return { leads, userleads, auth };
  } else {
    return {};
  }
}

export default connect(mapStateToProps)(RecruiterDashboard);
