const btnId = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const updateBtn = document.getElementById("updateBtn");
const rollNo = document.getElementById("rollNo");
const fullName = document.getElementById("fullName");
const studentClass = document.getElementById("class");
const dob = document.getElementById("dob");
const address = document.getElementById("address");
const enrollDate = document.getElementById("enrollDate");
const connToken = "90932078|-31949218714671889|90961920";
updateBtn.disabled = true;

function validate(obj) {
    if (obj.rollNo === "") {
        return false;
    } else if (obj.studentClass === "") {
        return false;
    } else if (obj.address === "") {
        return false;
    } else if (obj.fullName === "") {
        return false;
    } else if (obj.dob === "") {
        return false;
    } else if (obj.enrollDate === "") {
        return false;
    }
    return true;
}

function createRequest(type) {
    if (type === "create") {
        const request = {
            token: connToken,
            cmd: "PUT",
            dbName: "SCHOOL-DB",
            rel: "STUDENT-TABLE",
            primaryKey: "roll_number",
            jsonStr: {}
        }
        return request;
    } else if (type === "read") {
        const request = {
            token: connToken,
            cmd: "GET_BY_KEY",
            dbName: "SCHOOL-DB",
            rel: "STUDENT-TABLE",
            primaryKey: "roll_number",
            jsonStr: {}
        }
        return request;
    } else if (type === "update") {
        const request = {
            token: connToken,
            cmd: "UPDATE",
            dbName: "SCHOOL-DB",
            rel: "STUDENT-TABLE",
            primaryKey: "roll_number",
            jsonStr: {}
        }
        return request;
    } else if ("delete") {
        const request = {
            token: connToken,
            cmd: "",
            dbName: "SCHOOL-DB",
            rel: "STUDENT-TABLE",
            primaryKey: "roll_number",
            jsonStr: {}
        }
    }
}

function checkStudent() {
    const request = createRequest("read");
    const jsonStr = {
        rollNo: rollNo.value
    }
    request.jsonStr = jsonStr;
    const body = JSON.stringify(request);
    fetch("http://api.login2explore.com:5577/api/irl", { method: "POST", body: body }).
        then((response) => response.json()).
        then((result) => {

            if (result.data !== "") {
                const studentData = JSON.parse(result.data);
                const student = studentData.record;
                address.value = student.address;
                dob.value = student.dob;
                enrollDate.value = student.enrollDate;
                studentClass.value = student.studentClass;
                fullName.value = student.fullName;
                rollNo.disabled = true;
                updateBtn.disabled = false;
                btnId.disabled = true;

            }
        }).
        catch((error) => console.log(error));
}

btnId.addEventListener("click", function (e) {
    e.preventDefault();
    const request = createRequest("create");
    const jsonStr = {
        rollNo: rollNo.value,
        fullName: fullName.value,
        studentClass: studentClass.value,
        address: address.value,
        dob: dob.value,
        enrollDate: enrollDate.value
    }
    if (validate(jsonStr)) {
        request.jsonStr = jsonStr;
        const body = JSON.stringify(request);
        console.log(request)
        fetch("http://api.login2explore.com:5577/api/iml", { method: "POST", body: body }).
            then((response) => response.json()).
            then((result) => {
                if (result.data === "") {
                    alert("some error occured");
                } else {
                    alert("Student registered successfully");
                }
            }).
            catch((error) => console.log(error));
    } else{
        alert("No empty fields accepted");
    }
});

resetBtn.addEventListener("click", function () {
    rollNo.value = "";
    address.value = "";
    fullName.value = "";
    dob.value = "";
    enrollDate.value = "";
    studentClass.value = "";
});

updateBtn.addEventListener("click", function () {
    const getRequest = createRequest("read");
    const jsonStr = {
        rollNo: rollNo.value
    }
    getRequest.jsonStr = jsonStr;
    const body = JSON.stringify(getRequest);
    console.log(getRequest)
    const data = fetch("http://api.login2explore.com:5577/api/irl",{method:"POST", body:body}).
    then((response) => response.json()).
    then((result) =>{
        return result.data
    }).
    catch((error)=>console.log(error));
    const updateReq = createRequest("update");
    const updateData = {
        rollNo: rollNo.value,
        fullName: fullName.value,
        studentClass: studentClass.value,
        address: address.value,
        dob: dob.value,
        enrollDate: enrollDate.value
    }
    if(validate(updateData)){
        const recordData = JSON.parse(data);
        updateReq.jsonStr[recordData.rec_no] = updateData;
        const body = JSON.stringify(updateReq)
        fetch("http://api.login2explore.com:5577/api/iml",{method:"POST",body: body}).
            then((response => response.json())).
            then((result)=>{
                if(result.data !== ""){
                    alert("student info updated!!");
                }
            }).
            catch((error)=> console.log(error));
    }
});