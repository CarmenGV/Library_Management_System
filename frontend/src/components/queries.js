import {gql} from '@apollo/client';

/* QUERIES
******************************** */
// GET ALL 
const GET_PROJECTS = gql`
    query Projects {
        projects {
            _id
            title
            createdDate
            department
            professors {
                _id
                firstName
                lastName
            }
            students {
                _id
                firstName
                lastName
            }
            applications {
                _id
                applicantId
                projectId
                status
            }
            numOfApplications
            numOfUpdates
        }
    }
`;
const GET_APPLICATIONS = gql`
    query Applications {
        applications{
            _id
            applicantId
            projectId
            applicationDate
            lastUpdatedDate
            status
            comments
        }
    }
`;
const GET_UPDATES = gql`
    query Update{
        update{
            _id
            posterId
            subject
            constent
            projectId
            poastedDate
            comments
            numOfComments
        }
    }
`;

// GET BY ID
const GET_USER_BY_ID = gql`
    query GetUserById($id: String!) {
        getUserById(_id: $id) {
            _id
            firstName
            lastName
            email
            password
            role
            department
            bio
            applications {
                _id
                applicantId
                projectId
                status
            }
            projects {
                _id
                title
                department
            }
            numOfApplications
            numOfProjects
        }
    }
`;
const GET_PROJECT_BY_ID = gql`
    query getProjectById($id: String!) {
        getProjectById(_id: $id) {
            _id
            title
        }
    }
`;
const GET_UPDATE_BY_ID = gql`
    query GetUpdateById($id: String!) {
        getUpdateById(_id: $id) {
            _id
            posterId
            subject
            content
            projectId {
                _id
                title
                department
            }
            postedDate
            comments
            numOfComments
        }
    }
`;
const GET_APPLICATION_BY_ID = gql`
    query GetApplicationById($id: String!) {
        getApplicationById(_id: $id) {
            _id
            applicantId
            projectId
            applicationDate
            lastUpdatedDate
            status
            comments
        }
    }
`;

// GET & SEARCH QUERIES
const GET_PROFESSORS_BY_PROJECT_ID = gql`
    query Query($projectId: String!){ 
        getProfessorsByProjectId(projectId: $projectId) {
            _id
            firstName
            lastName
            email
            role
            department
            bio
            applications{
                _id
                applicantId
                projectId
            }
            projects {
                _id
                title
            }
            numOfApplications
            numOfProjects
        }
    }
`;
const GET_STUDENT_BY_PROJECT_ID = gql`
    query Query($projectId: String!){
        getStudentsByProjectId(projectId: $projectId){
            _id
            firstName
            lastName
            email
            role
            department
            bio
            applications{
                _id
                applicantId
                projectId
            }
            projects {
                _id
                title
            }
            numOfApplications
            numOfProjects
        }
    }
`;
const PROJECTS_BY_DEPARTMENT = gql`
    query Query($department: Department!){
        projectsByDepartment(department: $department){
            _id
            title
            createdDate
            department
            professors {
                _id
                firstName
                lastName
            }
            students {
                _id
                firstName
                lastName
            }
            applications {
                _id
                applicantId
                projectId
                status
            }
            numOfApplications
            numOfUpdates
        }
    }
`;
const UDPATES_BY_SUBJECT = gql`
    query Query($subject: updateSubject!){
        updatesBySubject(updateSubject: $updateSubject){
            _id
            posterId
            subject
            constent
            projectId
            poastedDate
            comments
            numOfComments
        }
    }
`;
const PROJECTS_BY_CREATED_YEAR = gql`
    query Query($min: Int!, $max: Int!){
        projectsByCreatedYear(min: $min, max: $max){
            _id
            title
            createdDate
            department
            professors {
                _id
                firstName
                lastName
            }
            students {
                _id
                firstName
                lastName
            }
            applications {
                _id
                applicantId
                projectId
                status
            }
            numOfApplications
            numOfUpdates
        }
    }
`;
const SEARCH_PROJECT_BY_TITLE = gql`
    query Query($searchTerm: String!){
        searchProjectByTitle(searchTerm: $searchTerm){
            _id
            title
            createdDate
            department
            professors {
                _id
                firstName
                lastName
            }
            students {
                _id
                firstName
                lastName
            }
            applications {
                _id
                applicantId
                projectId
                status
            }
            numOfApplications
            numOfUpdates
        }
    }
`;
const SEARCH_USER_BY_NAME = gql`
    query Query($searchTerm: String!){
        searchUserByName(searchTerm: $searchTerm){
            _id
            firstName
            lastName
            email
            password
            role
            department
            bio
            applications {
                _id
                applicantId
                projectId
                status
            }
            projects {
                _id
                title
                department
            }
            numOfApplications
            numOfProjects
        }
    }
`;

/* MUTATIONS
******************************** */
// ADD
const ADD_USER = gql`
    mutation AddUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $role: Role!
        $department: Department!
        $bio: String
    ){
        addUser(
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
            role: $role
            department: $department
            bio: $bio
        ){
            _id
            firstName
            lastName    
        }
    }
`;
const ADD_PROJECT = gql`
    mutation AddProject(
        $title: String!
        $createdDate: String!
        $department: Department!
        $professorIds: [String!]!
        $studentIds: [String]
    ) {
        addProject(
            title: $title
            createdDate: $createdDate
            department: $department
            professorIds: $professorIds
            studentIds: $studentIds
        ) {
            _id
            title
            createdDate
            department
            professors {
                _id
                firstName
                lastName
            }
            students {
                _id
                firstName
                lastName
            }
            applications {
                _id
                applicantId
                projectId
                status
            }
            numOfApplications
            numOfUpdates
        }
    }
`;
const ADD_UPDATE = gql`
    mutation AddUpdate(
        $posterId: String!
        $subject: UpdateSubject!
        $content: String!
        $projectId: String!
    ) {
        addUpdate(
            posterId: $posterId
            subject: $subject
            content: $content
            projectId: $projectId
        ) {
            _id
            posterId
            subject
            constent
            projectId
            poastedDate
            comments
            numOfComments
        }
    }
`;
const ADD_APPLICATION = gql`
    mutation AddApplication(
        $applicantId: String!
        $projectId: String!
    ) {
        addApplication(
            applicationId: $applicationId
            projectId: $projectId
        ){
            _id
            applicantId
            projectId
            applicationDate
            lastUpdatedDate
            status
            comments
        }
    }
`;

// EDIT
const EDIT_USER = gql`
    mutation EditUser(
        $id: String!
        $firstName: String!
        $lastName: String!
        $email: String
        $password: String
        $role: Role
        $department: Department
        $bio: String
    ) {
        editUser(
            _id: $id
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
            role: $role
            department: $department
            bio: $bio
        ) {
            _id
            firstName
            lastName
            email
            password
            role
            department
            bio
            applications {
                _id
                applicantId
                projectId
                status
            }
            projects {
                _id
                title
                department
            }
            numOfApplications
            numOfProjects
        }
    }
`;
const EDIT_PROJECT = gql`
    mutation EditProject (
        $id: String!
        $title: String
        $department: Department
        $professorIds: [String]
        $studentIds: [String]
    ) {
        editProject (
            _id: $id
            title: $title
            department: $department
            professorIds: $professorIds
            studentIds: $studentIds
        ){
            _id
            title
            createdDate
            department
            professors {
                _id
                firstName
                lastName
            }
            students {
                _id
                firstName
                lastName
            }
            applications {
                _id
                applicantId
                projectId
                status
            }
            numOfApplications
            numOfUpdates
        } 
    }
`;
const EDIT_UPDATE = gql`
    mutation EditUpdate(
        $id: String!
        $posterId: String
        $subject: UpdateSubject
        $content: String
        $projectId: String
    ) {
        editUpdate(
            id: $id
            posterId: $posterId
            subject: $subject
            content: $content
            projectId: $projectId
        ){
            _id
            posterId
            subject
            constent
            projectId
            poastedDate
            comments
            numOfComments
        }
    }
`;
const EDIT_APPLICATION = gql`
    mutation EditApplication(
        $id: String!
        $applicantId: String
        $projectId: String
        $lastUpdatedDate: String
        $status: ApplicationStatus
    ) {
        editApplication(
            _id: $id
            applicantId: $applicantId
            projectId: $projectId
            lastUpdatedDate: $lastUpdatedDate
            status: $status
        ) {
            _id
            applicantId
            projectId
            applicationDate
            lastUpdatedDate
            status
            comments
        }
    }
`;

// DELETE
const REMOVE_USER = gql`
    mutation RemoveUser(
        $id: String!
    ) {
        removeUser(_id: $id) {
            _id
            firstName
            lastName
        }    
    }
`;
const REMOVE_PROJECT = gql`
    mutation RemoveProject (
        $id: String!
    ) {
        removeProject(_id: $id){
            _id
            title
        }
    }
`;
const REMOVE_UPDATE = gql`
    mutation RemoveUpdate(
        $id: String!
    ) {
        removeUpdate(
            id: $id
        ){
            _id    
        }
    }
`;
const REMOVE_APPLICATION = gql`
    mutation RemoveApplication(
        $id: String!
    ){
        removeApplication(
            id: $id
        ) {
            _id
        }
    }
`;

let exported = {
    
};