import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function UserInfo() {
  const [activeTab, setActiveTab] = useState("profile");

  const userData = {
    username: "Dani",
    email: "galat@gmail.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "Bogor, Indonesia",
    joined: "March 2024",
    status: "Active",
    bio: "Creative web developer with passion for building intuitive UIs and responsive applications.",
    skills: ["React", "JavaScript", "CSS", "Bootstrap", "UI/UX Design", "Node.js"],
    projects: [
      { name: "E-commerce Dashboard", tech: "React, Redux, Bootstrap" },
      { name: "Portfolio Site", tech: "HTML, CSS, JavaScript" },
      { name: "Task Management App", tech: "React, Firebase" }
    ],
    social: {
      github: "dani-dev",
      linkedin: "dani-webdev",
      twitter: "dani_codes"
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <div className="row">
                {/* Left sidebar */}
                <div className="col-md-4 text-center p-4">
                  <img
                    src={userData.avatar}
                    alt="User Avatar"
                    className="rounded-circle mb-3"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <h3 className="profile-username text-center">{userData.username}</h3>
                  <p className="text-muted text-center">{userData.role}</p>
                  <ul className="list-group list-group-unbordered mb-3">
                    <li className="list-group-item">
                      <b>Email</b> <span className="float-right">{userData.email}</span>
                    </li>
                    <li className="list-group-item">
                      <b>Status</b> <span className="float-right">{userData.status}</span>
                    </li>
                    <li className="list-group-item">
                      <b>Location</b> <span className="float-right"><FaMapMarkerAlt className="me-1" />{userData.location}</span>
                    </li>
                  </ul>
                </div>

                {/* Right content */}
                <div className="col-md-8">
                  <div className="card-body">
                    <ul className="nav nav-tabs mb-4">
                      {["profile", "skills", "projects"].map((tab) => (
                        <li className="nav-item" key={tab}>
                          <button 
                            className={`nav-link ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="tab-content">
                      {activeTab === "profile" && (
                        <div className="fade show active">
                          <h4>About Me</h4>
                          <p>{userData.bio}</p>
                        </div>
                      )}

                      {activeTab === "skills" && (
                        <div className="fade show active">
                          <h4>Technical Skills</h4>
                          <div className="row g-2">
                            {userData.skills.map((skill, index) => (
                              <div className="col-md-4 col-6" key={index}>
                                <div className="small-box bg-light p-2 text-center">
                                  {skill}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === "projects" && (
                        <div className="fade show active">
                          <h4>Projects</h4>
                          {userData.projects.map((project, index) => (
                            <div key={index} className="info-box mb-3">
                              <div className="info-box-content">
                                <h5>{project.name}</h5>
                                <span className="info-box-text">Technologies: {project.tech}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="social-links mt-4">
                      <a href={`https://github.com/${userData.social.github}`} className="btn btn-default mr-2" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={20} />
                      </a>
                      <a href={`https://linkedin.com/in/${userData.social.linkedin}`} className="btn btn-default mr-2" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={20} />
                      </a>
                      <a href={`https://twitter.com/${userData.social.twitter}`} className="btn btn-default" target="_blank" rel="noopener noreferrer">
                        <FaTwitter size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
