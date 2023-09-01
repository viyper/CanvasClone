var classesWrapper = document.getElementById("classesWrapper");
var toDoWrapper = document.getElementById("toDoWrapper");
var hideParamsElements = document.getElementsByClassName("assignmentParamFilter");
var hideTypeElements = document.getElementsByClassName("assignmentTypeFilter");
let clickDivs;
let classesDict = new Array();
let ids = new Array();
let badID = new Array();
let names = new Array();
let months = new Array("January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December");
let paramFilterVals = new Array();
let typeFilterVals = new Array();

function fillRequestHeader(req) {
    req.setRequestHeader("domain", getCookie("domain"));
    req.setRequestHeader("token", getCookie("token"));
}

window.onload = () => {   
    //Type Filter
    for (let i = 0; i < hideTypeElements.length; i++) {
        hideTypeElements[i].addEventListener("click", function () {
            let val = hideTypeElements[i].value;
            let parseWord = val.split(" ")[1];
            let hidingClass = document.getElementsByClassName(`assignment${parseWord}`);
            if (hideTypeElements[i].checked != false) {
                if (val != "Hide No Type" && val != "Toggle Type") {
                    for (let i = 0; i < hidingClass.length; i++) {
                        hidingClass[i].classList.add("hidden");
                    }
                    typeFilterVals.push(`assignment${parseWord}`);
                } else if (val == "Hide No Type") {
                    for (let i = 0; i < typeFilterVals.length; i++) {
                        let remove = document.getElementsByClassName(typeFilterVals[i]);
                        for (let p = 0; p < remove.length; p++) {
                            remove[p].classList.remove("hidden");
                        }
                    }
                    typeFilterVals = new Array();
                    for (let p = 0; p < hideTypeElements.length; p++) {
                        hideTypeElements[p].checked = false;
                    }
                } else {
                    let allHide = document.getElementsByClassName("assignmentTypeFilter");
                    for (let i = 0; i < allHide.length; i++) {
                        let val = allHide[i].value;
                        if (val != "Hide No Type" && val != "Toggle Type") {
                            let parseWord = val.split(" ")[1];
                            let hidingClass = document.getElementsByClassName(`assignment${parseWord}`);
                            if (allHide[i].checked == false) {
                                for (let i = 0; i < hidingClass.length; i++) {
                                    hidingClass[i].classList.add("hidden");
                                }
                                typeFilterVals.push(`assignment${parseWord}`);
                            } else {
                                let remove = document.getElementsByClassName(`assignment${parseWord}`);
                                for (let p = 0; p < remove.length; p++) {
                                    remove[p].classList.remove("hidden");
                                }
                                typeFilterVals.splice(typeFilterVals.indexOf(`assignment${parseWord}`), 1);
                            }
                            allHide[i].checked = !allHide[i].checked;

                        }
                        document.getElementById("Toggle Type").checked = !document.getElementById("Toggle Type").checked;
                    }
                }
            } else {
                let remove = document.getElementsByClassName(`assignment${parseWord}`);
                for (let p = 0; p < remove.length; p++) {
                    remove[p].classList.remove("hidden");
                }
                typeFilterVals.splice(typeFilterVals.indexOf(`assignment${parseWord}`), 1);
            }

        });
    }

    //Params Filter
    for (let i = 0; i < hideParamsElements.length; i++) {
        hideParamsElements[i].addEventListener("click", function () {
            let val = hideParamsElements[i].value;
            let parseWord = val.split(" ")[1];
            let hidingClass = document.getElementsByClassName(`assignment${parseWord}`);
            if (hideParamsElements[i].checked != false) {
                if (val != "Hide No Param" && val != "Toggle Param") {
                    for (let i = 0; i < hidingClass.length; i++) {
                        hidingClass[i].classList.add("hidden");
                    }
                    paramFilterVals.push(`assignment${parseWord}`);
                } else if (val == "Hide No Param") {
                    for (let i = 0; i < paramFilterVals.length; i++) {
                        let remove = document.getElementsByClassName(paramFilterVals[i]);
                        for (let p = 0; p < remove.length; p++) {
                            remove[p].classList.remove("hidden");
                        }
                    }
                    paramFilterVals = new Array();
                    for (let p = 0; p < hideParamsElements.length; p++) {
                        hideParamsElements[p].checked = false;
                    }
                } else {
                    let allHide = document.getElementsByClassName("assignmentParamFilter");
                    for (let i = 0; i < allHide.length; i++) {
                        let val = allHide[i].value;
                        if (val != "Hide No Param" && val != "Toggle Param") {
                            let parseWord = val.split(" ")[1];
                            let hidingClass = document.getElementsByClassName(`assignment${parseWord}`);
                            if (allHide[i].checked == false) {
                                for (let i = 0; i < hidingClass.length; i++) {
                                    hidingClass[i].classList.add("hidden");
                                }
                                paramFilterVals.push(`assignment${parseWord}`);
                            } else {
                                let remove = document.getElementsByClassName(`assignment${parseWord}`);
                                for (let p = 0; p < remove.length; p++) {
                                    remove[p].classList.remove("hidden");
                                }
                                paramFilterVals.splice(paramFilterVals.indexOf(`assignment${parseWord}`), 1);
                            }
                            allHide[i].checked = !allHide[i].checked;

                        }
                        document.getElementById("Toggle Param").checked = !document.getElementById("Toggle Param").checked;
                    }
                } 
            } else {
                let remove = document.getElementsByClassName(`assignment${parseWord}`);
                for (let p = 0; p < remove.length; p++) {
                    remove[p].classList.remove("hidden");
                }
                paramFilterVals.splice(paramFilterVals.indexOf(`assignment${parseWord}`), 1);
            }
            
        });
    }

    let x = new XMLHttpRequest();
    x.open("GET", 'coursesByUser/self');

    fillRequestHeader(x);

    x.onload = () => {
        let classes = JSON.parse(x.response).filter((x) => {
            return x.access_restricted_by_date != true;
        });
        names = classes.map((classObj) => classObj.name);
        ids = classes.map((classObj) => classObj.id);
        //console.log(ids);
        for (let i = 0; i < names.length; i++) {
            let p = names[i].split(' - ');
            classesDict[i] = `name=${p[0]};id=${ids[i]}`
            //classNames.innerHTML += '<br>' + p[0];
            classesWrapper.innerHTML += `<div class="className" id="className_${ids[i]}">${p[0]}</div>
            <div id="classOther_${ids[i]}"><input class="custom_URL" id="boxLink_${ids[i]}" placeholder="Input custom URL"></input></div>
            <div id="classTeacher_${ids[i]}"></div>`
        }
        console.log(classesDict);

        for (let i = 0; i < ids.length; i++) {
            //console.log("request: " + i);
            let z = new XMLHttpRequest();
            //console.log(ids[i]);
            z.open("GET", `getCourseTeachers/${ids[i]}`);
            fillRequestHeader(z);
            z.onload = () => {
                
                if (z.response == "error") {
                    badID += ids[i];
                    document.getElementById(`className_${ids[i]}`).remove();
                    document.getElementById(`classTeacher_${ids[i]}`).remove();
                    document.getElementById(`classOther_${ids[i]}`).remove();
                } else {
                    let teachers = JSON.parse(z.response);
                    //console.log(teachers);
                    if (teachers.length > 3) {
                        document.getElementById(`classTeacher_${ids[i]}`).innerHTML += `This class has ${teachers.length} teachers`;
                    } else {
                        for (let l = 0; l < teachers.length; l++) {
                            document.getElementById(`classTeacher_${ids[i]}`).innerHTML += teachers[l]["name"] + "<br>";
                        }
                    }
                }
            }
            z.send();

            let c = new XMLHttpRequest();
            c.open("GET", `getCourseAssignments/${ids[i]}`);
            fillRequestHeader(c);
            c.onload = () => {
                if (c.response == "error") {
                    console.log("error");
                } else {
                    let assignments = JSON.parse(c.response);
                    //console.log(assignments);
                    //let names = classes.map((assignment) => assignment.name);
                    for (let p = 0; p < assignments.length; p++) {
                        //let d = new Date(assignments[i].due_at);
                        let d = assignments[i].due_at.split('-');
                        let month = parseInt(d[1]);
                        let day = d[2].slice(0, 2);
                        let year = d[0];
                        let mString = months[month];
                        if (badID.includes(i)) {
                            console.log("bad");
                        } else {
                            var typeDiv = document.createElement('div');
                            typeDiv.id = `assignment_${assignments[p].id}_Type`;
                            typeDiv.className = "assignmentType";
                            typeDiv.style = "cursor: pointer;";

                            var nameDiv = document.createElement('div');
                            nameDiv.id = `assignment_${assignments[p].id}_Name`;
                            nameDiv.className = "assignmentName";
                            nameDiv.innerHTML = `${assignments[p].name}`;
                            nameDiv.style = "cursor: pointer;";

                            var classDiv = document.createElement('div');
                            classDiv.id = `assignment_${assignments[p].id}_Class`;
                            classDiv.className = "assignmentClass";
                            classDiv.innerHTML = `${names[i]}`;
                            classDiv.style = "cursor: pointer;";

                            var dueDiv = document.createElement('div');
                            dueDiv.id = `assignment_${assignments[p].id}_Due`;
                            dueDiv.className = "assignmentDue";
                            dueDiv.innerHTML = `${mString}, ${day} ${year}`;
                            dueDiv.style = "cursor: pointer;";
                            if (assignments[p].submission_types[0] != "none") {
                                if (assignments[p].submission.workflow_state == "submitted") {
                                    typeDiv.className += " assignmentSubmitted";
                                    nameDiv.className += " assignmentSubmitted";
                                    classDiv.className += " assignmentSubmitted";
                                    dueDiv.className += " assignmentSubmitted";
                                    //console.log(assignments[p]);
                                    //console.log("submitted");

                                } else if (assignments[p].submission.workflow_state == "unsubmitted" && assignments[p].submission_types[0] != "on_paper") {
                                    typeDiv.className += " assignmentUnsubmitted";
                                    nameDiv.className += " assignmentUnsubmitted";
                                    classDiv.className += " assignmentUnsubmitted";
                                    dueDiv.className += " assignmentUnsubmitted";
                                    //console.log(assignments[p]);
                                    //console.log("unsubmitted");
                                } else if (assignments[p].submission.workflow_state == "graded") {
                                    typeDiv.className += " assignmentGraded";
                                    nameDiv.className += " assignmentGraded";
                                    classDiv.className += " assignmentGraded";
                                    dueDiv.className += " assignmentGraded";
                                    //console.log(assignments[p]);
                                    //console.log("graded");
                                } else {
                                    //console.log(assignments[p]);
                                    //console.log(assignments[p].submission.workflow_state);
                                }

                                if (assignments[p].submission_types[0] == "on_paper" && assignments[p].submission_types.length == 1) {
                                    typeDiv.className += " assignmentPaper";
                                    nameDiv.className += " assignmentPaper";
                                    classDiv.className += " assignmentPaper";
                                    dueDiv.className += " assignmentPaper";
                                }
                                if (assignments[p].locked_for_user) {
                                    typeDiv.className += " assignmentLocked";
                                    nameDiv.className += " assignmentLocked";
                                    classDiv.className += " assignmentLocked";
                                    dueDiv.className += " assignmentLocked";
                                }
                            } else {
                                typeDiv.className += " assignmentNoSubmission";
                                nameDiv.className += " assignmentNoSubmission";
                                classDiv.className += " assignmentNoSubmission";
                                dueDiv.className += " assignmentNoSubmission";
                            }
                            typeDiv.setAttribute("href", assignments[p].html_url);
                            nameDiv.setAttribute("href", assignments[p].html_url);
                            classDiv.setAttribute("href", assignments[p].html_url);
                            dueDiv.setAttribute("href", assignments[p].html_url);
                            toDoWrapper.appendChild(typeDiv);
                            toDoWrapper.appendChild(nameDiv);
                            toDoWrapper.appendChild(classDiv);
                            toDoWrapper.appendChild(dueDiv);
                            typeDiv.addEventListener("click", function () {
                                console.log(typeDiv);
                                window.open(this.attributes.href.value, '_blank');
                            });
                            nameDiv.addEventListener("click", function () {
                                window.open(this.attributes.href.value, '_blank');
                            });
                            classDiv.addEventListener("click", function () {
                                window.open(this.attributes.href.value, '_blank');
                            });
                            dueDiv.addEventListener("click", function () {
                                window.open(this.attributes.href.value, '_blank');
                            });
                        }
                    }
                }
            }
            c.send();
        }
        
    }
    x.send();
    clickDivs = document.getElementsByClassName("assignmentType");
    console.log(clickDivs);
    //clickDivs.push(document.getElementsByClassName("assignmentName"));
    //clickDivs.push(document.getElementsByClassName("assignmentClas"));
    //clickDivs.push(document.getElementsByClassName("assignmentDue"));
    //Add click listener for assignments
    /*for (let i = 0; i < clickDivs.length; i++) {
        console.log(clickDivs[i]);
        clickDivs[i].addEventListener("click", function () {
            window.open(clickDivs[i].style.href, '_blank');
        });
    }*/
};


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}