class employeeResponse {
    constructor(empId, firstName, middleName, lastName, email, workMail, contactNumber, dateOfBirth,
        gender, addresses, bloodGroup, dateOfJoin, imageFolder, dateOfExit, designations, roleRef, departmentId, employmentType,
        workLocation, status, maritalStatus, emergencyContactName, emergencyContactNumber, emergencyContactRelation, repManagerRef, departmentName, designationName) {
        this.empId = empId;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.workMail = workMail;
        this.contactNumber = contactNumber;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.addresses = addresses;
        this.bloodGroup = bloodGroup;
        this.dateOfJoin = dateOfJoin;
        this.imageFolder = imageFolder;
        this.dateOfExit = dateOfExit;
        this.designations = designations;
        this.roleRef = roleRef;
        this.departmentId = departmentId;
        this.employmentType = employmentType;
        this.workLocation = workLocation;
        this.status = status;
        this.maritalStatus = maritalStatus;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactNumber = emergencyContactNumber;
        this.emergencyContactRelation = emergencyContactRelation;
        this.repManagerRef = repManagerRef;
        this.departmentName = departmentName;
        this.designationName = designationName;
    }

    static fromEntity(employee) {
        return new employeeResponse(
            employee.empId,
            employee.firstName,
            employee.middleName,
            employee.lastName,
            employee.email,
            employee.workMail,
            employee.contactNumber,
            employee.dateOfBirth,
            employee.gender,
            employee.addresses,
            employee.bloodGroup,
            employee.dateOfJoin,
            employee.imageFolder,
            employee.dateOfExit,
            employee.designations,
            employee.roleRef,
            employee.departmentId,
            employee.employmentType,
            employee.workLocation,
            employee.status,
            employee.maritalStatus,
            employee.emergencyContactName,
            employee.emergencyContactNumber,
            employee.emergencyContactRelation,
            employee.repManagerRef,
            employee.departmentName,
            employee.designationName
        );
    }
}

module.exports = employeeResponse;