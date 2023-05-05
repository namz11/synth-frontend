export const checkFirstName = (str) => {
  if (!str || str.trim().length === 0) {
    throw "First Name cannot be empty or contain only spaces";
  }

  if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(str)) {
    throw "First Name can only contain letters and spaces";
  }

  const words = str.trim().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    if (words[i].length < 2) {
      throw "First Name must be at least two characters long";
    }
  }

  return str.trim();
};

export const checkLastName = (str) => {
  if (!str || str.trim().length === 0) {
    throw "Last Name cannot be empty or contain only spaces";
  }

  if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(str)) {
    throw "Last Name can only contain letters and spaces";
  }

  const words = str.trim().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    if (words[i].length < 2) {
      throw "Last Name must be at least two characters long";
    }
  }

  return str.trim();
};

export const checkEmail = (str) => {
  if (!str || str.trim().length === 0) {
    throw "Email address cannot be empty or contain only spaces";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    throw "Please enter a valid email address";
  }

  return str.trim();
};

export const validateImageInput = (file) => {
  console.log("Enters The Validator");
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(file.name)) {
    console.log("Enters Error Zone 1");
    throw "Invalid file type. Allowed types are .jpg, .jpeg, .png, and .gif";
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    console.log("Enters Error Zone 2");
    throw "Image file size must be under 5MB";
  }

  console.log("Enters Success Zone");
  return file;
};
