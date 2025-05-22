import EditJobForm from '@/components/forms/EditJobForm';
import { getMyJobMutation } from '@/lib/Services';
import { userConected } from '@/utils/userConected';
import React from 'react'

type Params = Promise<{ jobId: string }>;
const page = async ({ params }: { params: Params }) => {
    const user = await userConected();
  const { jobId } = await params;
  const jobData = await getMyJobMutation(jobId, user.id as string);

    if (!jobData) {
        return <div>Job not found</div>
    }
  return (
    <EditJobForm job={jobData} />
  )
}

export default page