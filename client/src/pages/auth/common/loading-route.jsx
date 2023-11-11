import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganizationList } from "@clerk/clerk-react";

const LoadingRoute = () => {
    const navigate = useNavigate();
    const { organizationList } = useOrganizationList();
    let organizationId;
    let userRole;

    useEffect(() => {
        let timer;
        
        timer = setTimeout(() => {
            if (organizationList.length === 0) {
                navigate("/error");
            } else {
                organizationList.map(({ organization, membership }) => (
                    organizationId = organization.id,
                    userRole = membership.role
                ));
                
                if (organizationId) {
                    if (userRole === "admin") {
                        navigate('/organisations');
                    }
                    if (userRole === "basic_member") {
                        navigate("/overview");
                    }
                } else {
                // navigate("/error"); // Handle organization not found
                }
            }
        }, 3000);
        return () => {
            clearTimeout(timer); 
        };
    }, [organizationList]);

    return (
        <div className="min-h-screen">
            <div className="container">
                <div className="flex justify-center flex-wrap items-center min-h-screen flex-col text-center">
                    <>
                    <svg
                        className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        ></circle>
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    </>
                    <h4 className="text-3xl font-medium text-slate-900 dark:text-white mb-2">
                        Please wait
                    </h4>
                    <p className="font-normal text-base text-slate-500 dark:text-slate-300">
                        while we sign you in to your organisation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingRoute;