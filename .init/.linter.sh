#!/bin/bash
cd /home/kavia/workspace/code-generation/role-based-learning-management-system-lms-without-authentication-253160-253364/SupabaseDatabaseandStorage
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

