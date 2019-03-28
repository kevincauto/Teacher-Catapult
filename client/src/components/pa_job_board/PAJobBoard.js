import React, { Component } from 'react';
import { connect } from 'react-redux';
import RightSidebar from '../RightSidebar';
import EmailTextbox from '../EmailTextbox';
import SmallBanner from '../advertisements/SmallBanner';
import { Helmet } from "react-helmet";
import {
  getJobs,
  getPhillyJobs,
  getPghJobs,
  getLehighJobs,
  getPaDutchJobs,
  getErieJobs,
  getCentralJobs,
  getScrantonJobs,
} from '../../selectors/jobSelector';
import './pa-job-board.css';

class PAJobBoard extends Component {
  state = {
    filterText: '',
    dropdownClass: 'dropdown-content',
    dropdownText: 'Select PA Region',

    sortByJob: false,
    jobReverseAlphabetical: false,

    sortByLocation: false,
    locationReverseAlphabetical: false,

    sortByDate: false,
    dateReverse: false,

    filterPhilly: false,
    filterPgh: false,
    filterLehigh: false,
    filterPaDutch: false,
    filterErie: false,
    filterScranton: false,
    filterCentral: false,

    numberOfJobsDisplayed: null,
  };

  handleFilterText = (e) => {
    this.setState({ filterText: e.target.value });
  }

  sortByjobName = (arrOfJobs) => {
    return arrOfJobs.sort((a, b) => {
      const textA = a.jobTitle.trim().toUpperCase();
      const textB = b.jobTitle.trim().toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
  }

  sortByCityName = (arrOfJobs) => {
    return arrOfJobs.sort((a, b) => {
      const textA = a.city.trim().toUpperCase();
      const textB = b.city.trim().toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
  }

  sortByDate = (arrOfJobs) => {
    return arrOfJobs.sort((a, b) => {
      const textA = a.date.trim().toUpperCase();
      const textB = b.date.trim().toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
  }
  putPaedJobsLast = (arrOfJobs) => {
    const paedJobs = arrOfJobs.filter(job => job.schoolId === 'paed');
    const otherJobs = arrOfJobs.filter(job => job.schoolId !== 'paed')
    return otherJobs.concat(paedJobs);
  }

  tableHeaderJobInfoClicked = (arrOfJobs) => {
    const { jobReverseAlphabetical } = this.state;
    this.sortByjobName(arrOfJobs)
    const result = jobReverseAlphabetical ? arrOfJobs.reverse() : arrOfJobs;
    this.setState({
      sortByJob: false,
      jobReverseAlphabetical: !jobReverseAlphabetical,
      sortByLocation: false,
      locationReverseAlphabetical: false,
      sortByDate: false,
      dateReverse: false
    })
    return result;
  }
  tableHeaderLocationClicked = (arrOfJobs) => {
    const { locationReverseAlphabetical } = this.state;
    this.sortByCityName(arrOfJobs)

    const result = locationReverseAlphabetical ? arrOfJobs.reverse() : arrOfJobs;
    this.setState({
      sortByJob: false,
      jobReverseAlphabetical: false,
      sortByLocation: false,
      locationReverseAlphabetical: !locationReverseAlphabetical,
      sortByDate: false,
      dateReverse: false
    })
    return result;
  }
  tableHeaderDateClicked = (arrOfJobs) => {
    const { dateReverse } = this.state;
    this.sortByDate(arrOfJobs)

    const result = dateReverse ? arrOfJobs.reverse() : arrOfJobs;
    this.setState({
      sortByJob: false,
      jobReverseAlphabetical: false,
      sortByLocation: false,
      locationReverseAlphabetical: false,
      sortByDate: false,
      dateReverse: !dateReverse,
    })
    return result;
  }

  dropDownClicked = () => {
    const { dropdownClass } = this.state;
    if (dropdownClass === 'dropdown-content') {
      this.setState({ dropdownClass: 'dropdown-content show' })
    }
    if (dropdownClass === 'dropdown-content show') {
      this.setState({ dropdownClass: 'dropdown-content' })
    }
  }

  renderTable(JSONArrJobs = [], ArrPaidJobs = []) {
    const {
      filterPaDutch,
      filterLehigh,
      filterPhilly,
      filterPgh,
      filterCentral,
      filterErie,
      filterScranton,
      filterText,
      sortByDate,
      sortByJob,
      sortByLocation, } = this.state;
    const { lehighJobs, phillyJobs, pghJobs, paDutchJobs, erieJobs, scrantonJobs, centralJobs } = this.props;

    //by region
    if (filterPhilly) { JSONArrJobs = phillyJobs }
    if (filterPgh) { JSONArrJobs = pghJobs }
    if (filterLehigh) { JSONArrJobs = lehighJobs }
    if (filterPaDutch) { JSONArrJobs = paDutchJobs }
    if (filterErie) { JSONArrJobs = erieJobs }
    if (filterCentral) { JSONArrJobs = centralJobs }
    if (filterScranton) { JSONArrJobs = scrantonJobs }

    if (sortByJob) { JSONArrJobs = this.tableHeaderJobInfoClicked(JSONArrJobs) }
    if (sortByLocation) { JSONArrJobs = this.tableHeaderLocationClicked(JSONArrJobs) }
    if (sortByDate) { JSONArrJobs = this.tableHeaderDateClicked(JSONArrJobs) }

    JSONArrJobs = this.putPaedJobsLast(JSONArrJobs);

    // JSONArrJobs = ArrPaidJobs.reverse().concat(JSONArrJobs);
    JSONArrJobs = JSONArrJobs.filter(
      ({ jobTitle = '', city = '', county = '', state = '', sd = '' }) => {
        if (jobTitle.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) { return true }
        if (city.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) { return true }
        if (county.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) { return true }
        if (sd.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) { return true }
        if (state.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) { return true }
        return false;
      }
    );
    return JSONArrJobs.map((job) => {
      return (
        <tr key={job.jobId}>
          <td>
            <div className="row">
              <div className="col-sm-6">
                <a
                  className="job-name"
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {job.jobTitle}
                </a>
                <br />
                {job.sd}
                <br />
              </div>
              <div className="col-sm-4">
                {`${job.city}, ${job.state}`} <br />
                {job.county} <br />
              </div>
              <div className="col-sm-2 ">{job.date}</div>
            </div>
          </td>
        </tr>
      );
    });
  }

  render() {
    const { dropdownClass, dropdownText, filterText } = this.state;
    return (
      <div className="container">

        <Helmet>
          <title>Teaching Jobs in Pennsylvania - Teacher Catapult</title>
          <meta name="description" content="Looking for a teaching job in Pennsylvania? Our job board has hundreds of jobs all in one place." />

          <meta name="og:title" content="Teaching Jobs in Pennsylvania - Teacher Catapult" />
          <meta name="og:description"
            content="Looking for a teaching job in Pennsylvania? Our job board has hundreds of jobs all in one place." />
          <meta name="og:image" content="https://www.teachercatapult.com/img/tc-new-jobs.png" />
          <meta name="og:image:url" content="https://www.teachercatapult.com/img/tc-new-jobs.png" />
          <meta name="og:image:secure_url" content="https://www.teachercatapult.com/img/tc-new-jobs.png" />
        </Helmet>


        <img src="../../img/background.jpg" alt="bg" className="bg" />
        <div className='masthead'>
          <SmallBanner />
        </div>

        <div className="content-container container">
          <div className="row">
            <div className="col-md-8 col-lg-9">
              <center>
                <h2>
                  Teaching Jobs in PA<br />
                </h2>
                <h3>Hundreds of Jobs for Pennsylvania Teachers!</h3>
              </center>
              <div className="search-inputs">
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search..."
                  value={filterText}
                  onChange={e => this.handleFilterText(e)}
                />
                <br />
                <div className="dropdown">
                  <button onClick={() => this.dropDownClicked()} className="dropbtn">{dropdownText} <i className="fas fa-caret-down"></i></button>
                  <div className={dropdownClass}>
                    <a onClick={() => this.setState({ dropdownText: 'All of Pennsylvania', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: false, filterLehigh: false, filterPaDutch: false, filterErie: false, filterScranton: false, filterCentral: false })}>All Pennsylvania</a>
                    <a onClick={() => this.setState({ dropdownText: 'Philadelphia Area', dropdownClass: 'dropdown-content', filterPhilly: true, filterPgh: false, filterLehigh: false, filterPaDutch: false, filterErie: false, filterScranton: false, filterCentral: false })}>Philadelphia Area</a>
                    <a onClick={() => this.setState({ dropdownText: 'Pittsburgh/S.Western', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: true, filterLehigh: false, filterPaDutch: false, filterErie: false, filterScranton: false, filterCentral: false })}>Pittsburgh/S.Western PA</a>
                    <a onClick={() => this.setState({ dropdownText: 'PA Dutch Country', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: false, filterLehigh: false, filterPaDutch: true, filterErie: false, filterScranton: false, filterCentral: false })}>Pennsylvania Dutch Country</a>
                    <a onClick={() => this.setState({ dropdownText: 'Lehigh Valley', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: false, filterLehigh: true, filterPaDutch: false, filterErie: false, filterScranton: false, filterCentral: false })}>Lehigh Valley</a>
                    <a onClick={() => this.setState({ dropdownText: 'Scranton/N.Eastern', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: false, filterLehigh: false, filterPaDutch: false, filterErie: false, filterScranton: true, filterCentral: false })}>Scranton/N.Eastern</a>
                    <a onClick={() => this.setState({ dropdownText: 'Erie/N.Western', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: false, filterLehigh: false, filterPaDutch: false, filterErie: true, filterScranton: false, filterCentral: false })}>Erie/N.Western</a>
                    <a onClick={() => this.setState({ dropdownText: 'State College/Central', dropdownClass: 'dropdown-content', filterPhilly: false, filterPgh: false, filterLehigh: false, filterPaDutch: false, filterErie: false, filterScranton: false, filterCentral: true })}>State College/Central</a>
                  </div>
                </div>
              </div>

              <table className="table table-bordered table-striped table-hover">
                <thead>

                  <tr>
                    <td>
                      <div className='row'>
                        <div className="table-header col-sm-6" onClick={() => this.setState({ sortByJob: true })}>Job Information <i className="fas fa-caret-down"></i></div>
                        <div className="table-header vanishing-header col-sm-4" onClick={() => this.setState({ sortByLocation: true })}>Location <i className="fas fa-caret-down"></i></div>
                        <div className="table-header vanishing-header col-sm-2" onClick={() => this.setState({ sortByDate: true })}>Date <i className="fas fa-caret-down"></i></div>
                      </div>
                    </td>
                  </tr>

                </thead>
                <tbody>
                  {this.renderTable(this.props.jobs, this.props.paidjobs)}
                </tbody>
              </table>
              <div className="sidebar-border full-screen-only">
                <h4>Sign-Up To Get Emails</h4>
                <p>New job postings are sent right to your inbox weekly.</p>
                <EmailTextbox />
                <br />
                <br />
              </div>
              <p className="description-paragraph">
                Teaching jobs in PA are scattered across hundreds of school
                district websites across the internet. Teacher Catapult's small
                army of teachers and volunteers are proud to bring you hundreds
                of Pennsylvania teaching jobs. We love
                teachers and we do our best to find as many teaching jobs in PA
                that we can. We target all areas of Pennsylvania as well as all
                teaching specialities and grade levels.
              </p>
            </div>

            <RightSidebar />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { jobs, paidjobs } = state;
  if (jobs) {
    return {
      jobs: getJobs(state),
      paidjobs,
      phillyJobs: getPhillyJobs(state),
      pghJobs: getPghJobs(state),
      lehighJobs: getLehighJobs(state),
      paDutchJobs: getPaDutchJobs(state),
      scrantonJobs: getScrantonJobs(state),
      erieJobs: getErieJobs(state),
      centralJobs: getCentralJobs(state),
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps)(PAJobBoard);
