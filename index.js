var fs = require('fs');
var _ = require('lodash');
var gravatar = require('gravatar');
var Mustache = require('mustache');

var d = new Date();
var curyear = d.getFullYear();

function getMonth(startDateStr, language = 'en') {
    switch (startDateStr.substr(5,2)) {
    case '01':
        return language == 'fr' ? 'Janvier ' : "January ";
    case '02':
        return language == 'fr' ? 'Février ' : "February ";
    case '03':
        return language == 'fr' ? 'Mars ' : "March ";
    case '04':
        return language == 'fr' ? 'Avril ' : "April ";
    case '05':
        return language == 'fr' ? 'Mai ' : "May ";
    case '06':
        return language == 'fr' ? 'Juin ' : "June ";
    case '07':
        return language == 'fr' ? 'Juillet ' : "July ";
    case '08':
        return language == 'fr' ? 'Août ' : "August ";
    case '09':
        return language == 'fr' ? 'Septembre ' : "September ";
    case '10':
        return language == 'fr' ? 'Octobre ' : "October ";
    case '11':
        return language == 'fr' ? 'Novembre ' : "November ";
    case '12':
        return language == 'fr' ? 'Décembre ' : "December ";
    }
}

function render(resumeObject) {

    resumeObject.basics.capitalName = resumeObject.basics.name.toUpperCase();
    if(resumeObject.basics && resumeObject.basics.email) {
        resumeObject.basics.gravatar = gravatar.url(resumeObject.basics.email, {
                        s: '200',
                        r: 'pg',
                        d: 'mm'
                    });
    }
    if (resumeObject.basics.picture || resumeObject.basics.gravatar) {
        resumeObject.photo = resumeObject.basics.picture ? resumeObject.basics.picture : resumeObject.basics.gravatar;
    }

    _.each(resumeObject.basics.profiles, function(p){
        switch(p.network.toLowerCase()) {
            // special cases
            case "google-plus":
            case "googleplus":
                p.iconClass = "fa fa-google-plus";
                break;
            case "flickr":
            case "flicker":
                p.iconClass = "fa fa-flickr";
                break;
            case "dribbble":
            case "dribble":
                p.iconClass = "fa fa-dribbble";
                break;
            case "codepen":
                p.iconClass = "fa fa-codepen";
                break;
            case "soundcloud":
                p.iconClass = "fa fa-soundcloud";
                break;
            case "reddit":
                p.iconClass = "fa fa-reddit";
                break;
            case "tumblr":
            case "tumbler":
                p.iconClass = "fa fa-tumblr";
                break;
            case "stack-overflow":
            case "stackoverflow":
                p.iconClass = "fa fa-stack-overflow";
                break;
            case "blog":
            case "rss":
                p.iconClass = "fa fa-rss";
                break;
            case "gitlab":
                p.iconClass = "fa fa-gitlab";
                break;
            case "keybase":
                p.iconClass = "fa fa-key";
                break;
            default:
                // try to automatically select the icon based on the name
                p.iconClass = "fa fa-" + p.network.toLowerCase();
        }

        if (p.url) {
            p.text = p.url;
        } else {
            p.text = p.network + ": " + p.username;
        }
    });

    if (resumeObject.meta && resumeObject.meta.language) {
        if (resumeObject.meta.language == 'fr') {
            resumeObject.languageFR = true;
            resumeObject.languageEN = false;
        } else {
            resumeObject.languageEN = true
            resumeObject.languageFR = false;
        }
    } else {
        resumeObject.languageEN = true
        resumeObject.languageFR = false;
    }

    if (resumeObject.meta && resumeObject.meta.certificationsBeforeEducation) {
        if(resumeObject.meta.certificationsBeforeEducation == 'true') {
            resumeObject.certificationsBeforeEducation = true;
        } else {
            resumeObject.certificationsBeforeEducation = false;
        }
    } else {
        resumeObject.certificationsBeforeEducation = false;
    }

    if (resumeObject.meta && resumeObject.meta.languagesSide) {
        if(resumeObject.meta.languagesSide == 'right') {
            resumeObject.languagesSideRight = true;
            resumeObject.languagesSideLeft = false;
        } else {
            resumeObject.languagesSideRight = false;
            resumeObject.languagesSideLeft = true;
        }
    } else {
        resumeObject.languagesSideRight = true
        resumeObject.languagesSideLeft = false;
    }

    if (resumeObject.meta && resumeObject.meta.volunteerSide) {
        if(resumeObject.meta.volunteerSide == 'right') {
            resumeObject.volunteerSideRight = true;
            resumeObject.volunteerSideLeft = false;
        } else {
            resumeObject.volunteerSideRight = false;
            resumeObject.volunteerSideLeft = true;
        }
    } else {
        resumeObject.volunteerSideRight = true
        resumeObject.volunteerSideLeft = false;
    }

    if (resumeObject.work && resumeObject.work.length) {
        resumeObject.workBool = true;
        _.each(resumeObject.work, function(w){
            if (w.startDate) {
                w.startDateYear = (w.startDate || "").substr(0,4);
                w.startDateMonth = getMonth(w.startDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en');

            }
            if(w.endDate) {
                w.endDateYear = (w.endDate || "").substr(0,4);
                w.endDateMonth = getMonth(w.endDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en');
            } else {
                w.endDateYear = (resumeObject.meta && resumeObject.meta.language == 'fr') ? 'Présent' : 'Present'
            }
            if (w.highlights) {
                if (w.highlights[0]) {
                    if (w.highlights[0] != "") {
                        w.boolHighlights = true;
                    }
                }
            }
            if (w.meta) {
                let contractType = w.meta.contract.toLowerCase().replace("-", " ").replace(/é/gi, "e")
                if (contractType.includes("fixed term") || contractType.includes("cdd") || contractType.match(/ determine/g) != null) {
                    w.boolFixedTermContract = true
                }
            }
        });
    }

    if (resumeObject.volunteer && resumeObject.volunteer.length) {
        resumeObject.volunteerBool = true;
        _.each(resumeObject.volunteer, function(w){
            if (w.startDate) {
                w.startDateYear = (w.startDate || "").substr(0,4);
                w.startDateMonth = getMonth(w.startDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en');

            }
            if(w.endDate) {
                w.endDateYear = (w.endDate || "").substr(0,4);
                w.endDateMonth = getMonth(w.endDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en');
            } else {
                w.endDateYear = (resumeObject.meta && resumeObject.meta.language == 'fr') ? 'Présent' : 'Present'
            }
            if (w.highlights) {
                if (w.highlights[0]) {
                    if (w.highlights[0] != "") {
                        w.boolHighlights = true;
                    }
                }
            }
        });
    }

    if (resumeObject.education && resumeObject.education.length) {
        if (resumeObject.education[0].institution) {
            resumeObject.educationBool = true;
            _.each(resumeObject.education, function(e){
                if(!e.area || !e.studyType){
                  e.educationDetail = (e.area == null ? '' : e.area) + (e.studyType == null ? '' : e.studyType);
                } else {
                  e.educationDetail = e.area + ", "+ e.studyType;
                }
                if (e.startDate) {
                    e.startDateYear = e.startDate.substr(0,4);
                    e.startDateMonth = getMonth(e.startDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en');
                } else {
                    e.endDateMonth = "";
                }
                if (e.endDate) {
                    if (e.endDate.substr(0,4) === e.startDateYear) {
                        e.endDateYear = '';
                        e.endDateMonth = '';
                        e.endDateDoNotDisplay = true;
                    } else {
                        e.endDateYear = e.endDate.substr(0,4);
                        e.endDateMonth = getMonth(e.endDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en')

                        if (e.endDateYear > curyear) {
                            e.endDateYear = (resumeObject.meta && resumeObject.meta.language == 'fr') ? "(prévu) " + e.endDateYear : "(expected) " + e.endDateYear;
                        }
                    }
                } else {
                    e.endDateYear = (resumeObject.meta && resumeObject.meta.language == 'fr') ? 'Présent' : 'Present'
                    e.endDateMonth = '';
                }
                if (e.courses) {
                    if (e.courses[0]) {
                        if (e.courses[0] != "") {
                            e.educationCourses = true;
                        }
                    }
                }
            });
        }
        resumeObject.certifications = resumeObject.education.filter(e => RegExp(/Certification.*/).test(e.studyType));
        if (resumeObject.certifications[0]) {
            resumeObject.certificationsBool = true;
        }
        resumeObject.education = resumeObject.education.filter(e => !RegExp(/Certification.*/).test(e.studyType));
    }

    if (resumeObject.awards && resumeObject.awards.length) {
        if (resumeObject.awards[0].title) {
            resumeObject.awardsBool = true;
            _.each(resumeObject.awards, function(a){
                a.year = (a.date || "").substr(0,4);
                a.day = (a.date || "").substr(8,2);
                a.month = getMonth(a.date || "", (resumeObject.meta && resumeObject.meta.language) || 'en');
            });
        }
    }

    if (resumeObject.publications && resumeObject.publications.length) {
        if (resumeObject.publications[0].name) {
            resumeObject.publicationsBool = true;
            _.each(resumeObject.publications, function(a){
                a.year = (a.releaseDate || "").substr(0,4);
                a.day = (a.releaseDate || "").substr(8,2);
                a.month = getMonth(a.releaseDate || "", (resumeObject.meta && resumeObject.meta.language) || 'en');
            });
        }
    }

    if (resumeObject.skills && resumeObject.skills.length) {
        if (resumeObject.skills[0].name) {
            resumeObject.skillsBool = true;
        }
    }

    if (resumeObject.interests && resumeObject.interests.length) {
        if (resumeObject.interests[0].name) {
            resumeObject.interestsBool = true;
        }
    }

    if (resumeObject.languages && resumeObject.languages.length) {
        if (resumeObject.languages[0].language) {
            resumeObject.languagesBool = true;
        }
    }

    if (resumeObject.references && resumeObject.references.length) {
        if (resumeObject.references[0].name) {
            resumeObject.referencesBool = true;
			_.each(resumeObject.references, function(w){
				var details = w.reference.split(':')
                if (details.length == 4) {
					w.detailsBool = true;
					w.company = details[0];
					w.title = details[1];
					w.email = details[2];
					w.phone = details[3];
                } else {
                    w.detailsBool = false;
                }
            });
        }
    }

    resumeObject.css = fs.readFileSync(__dirname + "/style.css", "utf-8");
    resumeObject.printcss = fs.readFileSync(__dirname + "/print.css", "utf-8");
    var theme = fs.readFileSync(__dirname + '/resume.template.mu', 'utf8');
    var resumeHTML = Mustache.render(theme, resumeObject);


    return resumeHTML;
};
module.exports = {
    render: render
}
