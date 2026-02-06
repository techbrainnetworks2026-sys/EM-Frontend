# Manual Test Cases for Authentication Pages

## 1. Sign In Page

| Test Case ID | Test Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **SI-01** | Empty Fields Validation | 1. Navigate to Sign In page.<br>2. Leave Email and Password empty.<br>3. Click "Sign In". | Error messages "Email is required" and "Password is required" should appear below respective fields. |
| **SI-02** | Invalid Email Format | 1. Enter "invalid-email" in Email field.<br>2. Enter any password.<br>3. Click "Sign In". | Error message "Invalid email format" should appear. |
| **SI-03** | Missing Password | 1. Enter valid email.<br>2. Leave Password empty.<br>3. Click "Sign In". | Error message "Password is required" should appear. |
| **SI-04** | Invalid Credentials | 1. Enter non-existent email or wrong password.<br>2. Click "Sign In". | Toast/Alert message should display "User not found" or "Invalid credentials". |
| **SI-05** | Successful Login (Employee) | 1. Enter valid Employee email and password.<br>2. Click "Sign In". | Redirects to Employee Dashboard (`/employee/dashboard`). Success message displayed. |
| **SI-06** | Successful Login (Manager) | 1. Enter valid Manager email and password.<br>2. Click "Sign In". | Redirects to Manager Dashboard (`/manager/dashboard`). Success message displayed. |
| **SI-07** | Link to Sign Up | 1. Click "Sign Up" link. | Redirects to Sign Up page. |

---

## 2. Sign Up Page

| Test Case ID | Test Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **SU-01** | Empty Fields Validation | 1. Navigate to Sign Up page.<br>2. Leave all fields empty.<br>3. Click "Sign Up". | Error messages should appear for all required fields (Name, Email, Mobile, Dept, Design, Role, Password, Confirm Password). |
| **SU-02** | Invalid Email Format | 1. Enter "invalid-email" in Email field.<br>2. Click "Sign Up". | Error message "Invalid email format" should appear. |
| **SU-03** | Invalid Mobile Number | 1. Enter mobile number with < 10 digits or non-numeric.<br>2. Click "Sign Up". | Error message "Mobile number must be 10 digits" should appear. |
| **SU-04** | Password Mismatch | 1. Enter "password123" in Password.<br>2. Enter "password456" in Confirm Password.<br>3. Click "Sign Up". | Error message "Passwords do not match" should appear. |
| **SU-05** | Short/Simple Password | 1. Enter password "short" or "noNumbers".<br>2. Click "Sign Up". | Error message "Password must be at least 8 characters long" or "Password must contain at least one letter/number" should appear. |
| **SU-06** | Successful Registration | 1. Fill all fields with valid data.<br>2. Select Role (Employee/Manager).<br>3. detailed matching passwords.<br>4. Click "Sign Up". | Success message "User Data sent to Manager Approval, Successfully!" displayed. Redirects to Login page after delay. |
| **SU-07** | Link to Sign In | 1. Click "Sign In" link. | Redirects to Sign In page. |
