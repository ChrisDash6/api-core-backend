class TraineeRequest {
  constructor(req) {
    this.profileImage = req.file ? req.file.filename : null;

    this.firstName = req.firstName;
    this.middleName = req.middleName;
    this.lastName = req.lastName;
    this.email = req.email;
    this.workMail = req.workMail;
    this.contactNumber = req.contactNumber;
    this.dateOfBirth = req.dateOfBirth;
    this.gender = req.gender;
    this.bloodGroup = req.bloodGroup;
    this.dateOfJoin = req.dateOfJoin;
    this.dateOfExit = req.dateOfExit || null;
    this.roleRef = req.roleRef;
    this.departmentId = req.departmentId;
    this.designations = req.designations;
    this.employmentType = req.employmentType;
    this.workLocation = req.workLocation;
    this.status = req.status || "Active";
    this.accountNumber = req.accountNumber;
    this.transitNumber = req.transitNumber;
    this.institutionNumber = req.institutionNumber;
    this.bankName = req.bankName;
    this.interacId = req.interacId;
    this.sin = req.sin;
    this.taxCode = req.taxCode;
    this.workPermitDetails = req.workPermitDetails || null;
    this.prDetails = req.prDetails || null;
    this.citizenshipId = req.citizenshipId || null;
    this.maritalStatus = req.maritalStatus;
    this.emergencyContactName = req.emergencyContactName;
    this.emergencyContactNumber = req.emergencyContactNumber;
    this.emergencyContactRelation = req.emergencyContactRelation;
    this.repManagerRef = req.repManagerRef || null;
    this.healthCardNo = req.healthCardNo || "";
    this.familyPractitionerName = req.familyPractitionerName || "";
    this.practitionerClinicName = req.practitionerClinicName || "";
    this.practitionerName = req.practitionerName || "";
    this.logId = req.logId;

    try {
      this.addresses = req.addresses ? JSON.parse(req.addresses) : [];
    } catch (error) {
      this.addresses = [];
    }
  }

  static validate(requestBody) {
    const errors = [];

    // Validate basic trainee details
    if (!requestBody.firstName || requestBody.firstName.length < 3)
      errors.push("First name must be at least 3 characters.");
    if (!requestBody.lastName || requestBody.lastName.length < 3)
      errors.push("Last name must be at least 3 characters.");
    if (!requestBody.email || !/.+@.+\..+/.test(requestBody.email))
      errors.push("Invalid email format.");
    if (!requestBody.contactNumber || !/^\+?\d{10,15}$/.test(requestBody.contactNumber))
      errors.push("Invalid contact number format.");
    if (!requestBody.dateOfJoin)
      errors.push("Date of Joining is required.");
    if (!requestBody.departmentId)
      errors.push("Department ID is required.");
    if (!requestBody.roleRef)
      errors.push("Role Reference is required.");
    if (!requestBody.employmentType || !["Full-Time", "Part-Time", "Contract", "Internship"].includes(requestBody.employmentType))
      errors.push("Invalid employment type.");
    if (!requestBody.sin || !/^\d{3}-\d{3}-\d{3}$/.test(requestBody.sin))
      errors.push("SIN must follow the format XXX-XXX-XXX.");
    if (!requestBody.accountNumber)
      errors.push("Bank account number is required.");
    if (!requestBody.transitNumber || requestBody.transitNumber.length !== 5)
      errors.push("Transit Number must be exactly 5 digits.");
    if (!requestBody.institutionNumber || requestBody.institutionNumber.length !== 3)
      errors.push("Institution Number must be exactly 3 digits.");
    if (!requestBody.bankName)
      errors.push("Bank Name is required.");
    if (!requestBody.maritalStatus)
      errors.push("Marital Status is required.");
    if (!requestBody.emergencyContactName)
      errors.push("Emergency contact name is required.");
    if (!requestBody.emergencyContactNumber || !/^\d{10,15}$/.test(requestBody.emergencyContactNumber))
      errors.push("Invalid emergency contact number format.");
    if (!requestBody.emergencyContactRelation)
      errors.push("Emergency contact relation is required.");
    if (!requestBody.logId)
      errors.push("Log ID is required.");

    // Validate address details
    if (!requestBody.addresses || !Array.isArray(requestBody.addresses) || requestBody.addresses.length === 0)
      errors.push("At least one address is required.");

    if (requestBody.addresses) {
      requestBody.addresses.forEach((address, index) => {
        if (!address.type || !["temporary", "permanent"].includes(address.type))
          errors.push(`Address ${index + 1}: Invalid type (must be 'temporary' or 'permanent').`);
        if (!address.houseNo)
          errors.push(`Address ${index + 1}: House number is required.`);
        if (!address.street)
          errors.push(`Address ${index + 1}: Street is required.`);
        if (!address.city)
          errors.push(`Address ${index + 1}: City is required.`);
        if (!address.province)
          errors.push(`Address ${index + 1}: Province is required.`);
        if (!address.country)
          errors.push(`Address ${index + 1}: Country is required.`);
        if (!/^\d{5,6}$/.test(address.pincode))
          errors.push(`Address ${index + 1}: Invalid pincode format.`);
      });
    }

    return errors.length > 0 ? errors : null;
  }
}

module.exports = TraineeRequest;
