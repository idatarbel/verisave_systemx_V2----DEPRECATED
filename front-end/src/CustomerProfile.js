import './CustomerProfile.css';
import iconArrowLeft from './assets/arrow-left.svg';
import iconArrowRight from './assets/arrow-narrow-right.svg';
import iconPublished from './assets/badge-check.svg';
import iconApproved from './assets/badge-checkb.svg';
import iconReview from './assets/shield-exclamationg.svg';
import iconDraft from './assets/document-text.svg';
import iconWarning from './assets/exclamation.svg';
import iconError from './assets/exclamation-circle.svg';
import iconEdit from './assets/pencil.svg';
import iconView from './assets/eye.svg';
import iconDownload from './assets/download.svg';

function CustomerProfile() {
    return (
        <div class="page-body">
            <div class="profile-header">
                <div class="breadcrumb mt-1 mb-4">
                    <a href="#">
                        <img src={iconArrowLeft} alt="index" class="arrow-to-index"/>
                    </a>
                    Barrows Corporation
                </div>
            </div>
            <div class="flex">
                <div class="profile-box block">
                    <div class="columns-1 h-8 mb-4">
                        <div class="profile-box-title">
                            <h3 class="inline-table pt-0.5">Customer Information</h3>
                            <a href="#">
                                <img src={iconEdit} alt="edit" class="float-right inline"/>
                            </a>
                        </div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Company Name</div>
                        <div class="">Barrows Corporation</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Parent Company</div>
                        <div class="">Spiegel Inc</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Private Equity</div>
                        <div class="">Dan Spiegel Funding</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Association/Affiliation</div>
                        <div class="">The Death Star</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Referral Partner</div>
                        <div class="">Darth Vader</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Address</div>
                        <div class="">1 Jedi Way<br/>Tatooine, MW 2323232</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Verisave Industry</div>
                        <div class="">4311</div>
                    </div>
                    <div class="columns-2 mb-1">
                        <div class="font-semibold">Processor</div>
                        <div class="">Fiserv</div>
                    </div>
                </div>
                <div class="profile-box block">
                    <div class="mb-4">
                        <div class="profile-box-title">
                            <h3 class="inline-table pt-0.5">Statements</h3>
                            <a href="#" class="button-small bg-slate-500 float-right">View Audit Logs</a>
                        </div>
                    </div>
                    <div class="statements-table">
                        <table class="table-auto w-full text-left">
                            <thead>
                                <tr>
                                    <th>Statement Month</th>
                                    <th>Status</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="#">February 2023</a></td>
                                    <td>
                                        <a href="#">
                                            <img src={iconDraft} alt="" class="small-icon draft"/>
                                            Draft
                                            <img src={iconError} alt="" class="small-icon error ml-1"/>
                                            <img src={iconWarning} alt="" class="small-icon warning"/>
                                        </a>
                                    </td>
                                    <td><a href="#"><img src={iconArrowRight} alt="" class=""/></a></td>
                                </tr>
                                <tr>
                                    <td><a href="#">January 2023</a></td>
                                    <td>
                                        <a href="#">
                                            <img src={iconReview} alt="" class="small-icon review"/>
                                            In Review
                                        </a>
                                    </td>
                                    <td><a href="#"><img src={iconArrowRight} alt="" class=""/></a></td>
                                </tr>
                                <tr>
                                    <td><a href="#">December 2022</a></td>
                                    <td>
                                        <a href="#">
                                            <img src={iconApproved} alt="" class="small-icon approved"/>
                                            Approved
                                        </a>
                                    </td>
                                    <td><a href="#"><img src={iconArrowRight} alt="" class=""/></a></td>
                                </tr>
                                <tr>
                                    <td><a href="#">November 2022</a></td>
                                    <td>
                                        <a href="#">
                                            <img src={iconPublished} alt="" class="small-icon completed"/>
                                            Published
                                        </a>
                                    </td>
                                    <td><a href="#"><img src={iconArrowRight} alt="" class=""/></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="profile-box block">
                    <div class="columns-2 h-8 mb-2">
                        <div class="profile-box-title">
                            <h3 class="inline-table pt-0.5">Reports</h3>
                        </div>
                        <div class="inline float-right">
                            <select>
                                <option>January 2023</option>
                                <option>December 2022</option>
                                <option>November 2022</option>
                            </select>
                        </div>
                    </div>
                    <div>
                    <table class="table-auto w-full text-left reports">
                            <thead>
                                <tr>
                                    <th>Download All Reports</th>
                                    <th>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>10-point Monthly Checklist</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Volume & Transaction by Card Brand</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Volume & Transaction by Card Type</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Fees Analysis</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Baseline Comparison</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Interchange Effective Rates</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Downgrade Transaction Detail</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Customer Chargebacks Detail</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Customer Refunds Detail</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Monthly Savings Analysis</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Savings Missed</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Benchmark Data</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Forecast Data</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>New Savings Opportunities</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Leak Fixes by Month</td>
                                    <td>
                                        <a href="#">
                                            <img src={iconView} alt="" class="view-download"/>
                                        </a>
                                        <a href="#">
                                            <img src={iconDownload} alt="" class="view-download"/>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
  }
export default CustomerProfile;