from typing import Optional, List
from pydantic import BaseModel, Field


class Researcher(BaseModel):
    """Model for a researcher/lecturer at UM."""

    name: str = Field(description="Full name of the researcher")
    title: Optional[str] = Field(default=None, description="Academic title")
    department: Optional[str] = Field(default=None, description="Department or school")
    expertise: List[str] = Field(default_factory=list, description="Areas of expertise")
    email: Optional[str] = Field(default=None, description="Contact email")
    phone_number: Optional[str] = Field(
        default=None, description="Contact phone number"
    )
    profile_url: Optional[str] = Field(default=None, description="URL to full profile")
    image_url: Optional[str] = Field(
        default=None, description="URL to researcher's profile image"
    )
    cv_url: Optional[str] = Field(
        default=None, description="URL to researcher's CV if available"
    )
    faculty: str = Field(
        default="Faculty of Computer Science and Information Technology",
        description="Faculty name",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Dr. John Doe",
                "title": "Senior Lecturer",
                "department": "Department of Software Engineering",
                "expertise": ["Machine Learning", "Software Engineering"],
                "email": "john@um.edu.my",
                "phone_number": "+603-12345678",
                "profile_url": "https://umexpert.um.edu.my/john",
                "image_url": "https://umexpert.um.edu.my/images/john.jpg",
                "cv_url": "https://umexpert.um.edu.my/john.html",
                "faculty": "Faculty of Computer Science and Information Technology",
            }
        }
