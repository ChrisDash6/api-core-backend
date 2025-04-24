class traineeResponse {
  constructor(
    traineeId, firstName, middleName, lastName, email, workMail, contactNumber, dateOfBirth,
    gender, addresses, bloodGroup, dateOfJoin, imageFolder, dateOfExit, designations, roleRef,
    departmentId, employmentType, workLocation, status, maritalStatus, emergencyContactName,
    emergencyContactNumber, emergencyContactRelation, repManagerRef, departmentName, designationName
  ) {
    this.traineeId = traineeId;
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

  static fromEntity(trainee) {
    return new traineeResponse(
      trainee.traineeId,
      trainee.firstName,
      trainee.middleName,
      trainee.lastName,
      trainee.email,
      trainee.workMail,
      trainee.contactNumber,
      trainee.dateOfBirth,
      trainee.gender,
      trainee.addresses,
      trainee.bloodGroup,
      trainee.dateOfJoin,
      trainee.imageFolder,
      trainee.dateOfExit,
      trainee.designations,
      trainee.roleRef,
      trainee.departmentId,
      trainee.employmentType,
      trainee.workLocation,
      trainee.status,
      trainee.maritalStatus,
      trainee.emergencyContactName,
      trainee.emergencyContactNumber,
      trainee.emergencyContactRelation,
      trainee.repManagerRef,
      trainee.departmentName,
      trainee.designationName
    );
  }
}

module.exports = traineeResponse;
