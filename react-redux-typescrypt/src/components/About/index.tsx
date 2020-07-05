import React from 'react';
import { connect } from "react-redux";
import { showAbout } from '../../actions';
import { FiSkipBack } from 'react-icons/fi';
import './style.css';

export function About(props: any) {
    return (
        <div className="about-container">
            <div className="about-title">
                { props.language.about_author }
            </div>
            <div className="about-content">
                <div className="about-text-content">
                    <div className="about-text-content-title">
                        { props.language.proof_of_concept }
                    </div>                    
                    <div className="about-text-content-msg">
                        { props.language.about_text }
                    </div>
                </div>
                <div className="about-author-content">
                    <div className="about-author-title">
                        { props.language.author_title }
                    </div>
                    <div className="about-author-msg">
                        Fábio Pereira da Silva
                    </div>
                </div>
                <div className="about-email-content">
                    <div className="about-email-title">
                        E-mail:
                    </div>
                    <div className="about-email-msg">
                        fabioegel@gmail.com
                    </div>
                </div>
                <div className="about-github-content">
                    <div className="about-github-title">
                        github:
                    </div>
                    <div className="about-github-msg">
                        https://github.com/devfabiosilva/nano-electron
                    </div>
                </div>
                <div className="about-donation-content">
                    <div className="about-donation-title">
                        { props.language.donation }
                    </div>
                    <div className="about-donation-msg">
                        <div className="about-bitcoin-content">
                            <div className="about-bitcoin-title">
                                Bitcoin
                            </div>
                            <div className="about-bitcoin-address">
                                1JDckpLRJGhp46LTcjY1vsW19wurZ3L1d5
                            </div>
                        </div>
                        <div className="about-nano-content">
                            <div className="about-nano-title">
                                Nano
                            </div>
                            <div className="about-nano-address">
                                nano_1cb5fs7xmixqzpitfn9ouy4j1g3hjmdfudc1igt5xhwwps7qdku5htqxmznb
                            </div>
                        </div>
                        <div className="about-litecoin-content">
                            <div className="about-litecoin-title">
                                Litecoin
                            </div>
                            <div className="about-litecoin-address">
                                LRjEiKadFzPCoGorWvSVUnWPsFyPZGt97f
                            </div>
                        </div>
                        <div className="about-dogecoin-content">
                            <div className="about-dogecoin-title">
                                Dogecoin
                            </div>
                            <div className="about-dogecoin-address">
                                DRrWWMdwY6AN8rdz7zH2cp3qaK8vSgDTau
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about-button-content">
                <button 
                    
                    className="about-button-go-back" 
                    onClick={ props.goBack } 
                    title={ props.language.go_back }
                
                >
                    <FiSkipBack size={16} style={{marginRight: "4px"}} /> { props.language.go_back }
                </button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: any, ownProps: any) => ({

    language: state.lang

});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({

    goBack: () => dispatch(showAbout(false))

});

export default connect(mapStateToProps, mapDispatchToProps)(About);
