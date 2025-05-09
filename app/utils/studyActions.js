import backendUrl from "environment";

export const fetchStudies = async (router, setStudies, onError) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch studies");
        }

        const data = await response.json();
        setStudies(data);
    } catch (error) {
        console.error("Error fetching studies:", error);
        if (onError) onError(error.message);
    }
};

export const createStudy = async (router, onError) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Fetch existing studies to determine the next number
        const studiesResponse = await fetch(`${backendUrl}/api/studies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!studiesResponse.ok) {
            throw new Error('Failed to fetch studies');
        }

        const existingStudies = await studiesResponse.json();

        // Find the highest number in existing "Untitled Study X" titles
        const untitledPattern = /^Untitled Study (\d+)$/;
        let highestNumber = 0;

        existingStudies.forEach(study => {
            const match = study.title.match(untitledPattern);
            if (match) {
                const number = parseInt(match[1]);
                highestNumber = Math.max(highestNumber, number);
            }
        });

        // Create new study with incremented number
        const newNumber = highestNumber + 1;
        const response = await fetch(`${backendUrl}/api/studies`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: `Untitled Study ${newNumber}`,
                description: 'No description'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create study');
        }

        const newStudy = await response.json();
        router.push(`/create?studyId=${newStudy._id}`);
    } catch (error) {
        console.error('Error creating study:', error);
        if (onError) onError(error.message);
    }
};

export const fetchStudyDetails = async (studyId, router, onStudyChange, onError) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${studyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch study details");
        }

        const studyDetails = await response.json();
        if (onStudyChange) {
            onStudyChange(studyDetails);
        }
    } catch (error) {
        console.error("Error fetching study details:", error);
        if (onError) onError(error.message);
    }
};

export const deleteStudy = async (study, router, onClose, onStudyDeleted, onError) => {
    if (!study?._id) {
        console.error("Study ID is missing for deletion.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            if (onClose) onClose();
            if (onStudyDeleted) onStudyDeleted();
        } else {
            throw new Error(data.error || "Failed to delete study");
        }
    } catch (error) {
        console.error("Error deleting study:", error);
        if (onError) onError(error.message);
    }
};

export const startStudy = async (study, onStudyUpdated, onError) => {
    if (!study?._id) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: true, completed: false }),
        });

        if (response.ok) {
            const data = await response.json();
            if (onStudyUpdated) onStudyUpdated(data);
        } else {
            const errorText = await response.text();
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || 'Failed to start study';
            } catch (e) {
                errorMessage = errorText || 'Failed to start study', e;
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Error starting study:", error);
        if (onError) onError(error.message);
    }
};

export const endStudy = async (study, onStudyUpdated, onError) => {
    if (!study?._id) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${backendUrl}/api/studies/${study._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: false, completed: true }),
        });

        if (response.ok) {
            const data = await response.json();
            if (onStudyUpdated) onStudyUpdated(data);
        } else {
            const errorText = await response.text();
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || 'Failed to end study';
            } catch (e) {
                errorMessage = errorText || 'Failed to end study', e;
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Error ending study:", error);
        if (onError) onError(error.message);
    }
};

export const editStudy = (study, router) => {
    if (!study?._id) {
        console.error("Study ID is missing for editing.");
        return;
    }
    router.push(`/create?studyId=${study._id}`);
};