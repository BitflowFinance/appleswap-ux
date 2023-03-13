import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { userSession as stacksUserSession } from 'src/stacksUserSession'

export const authGuard = () => {
  const router = inject(Router)
  const userSession = stacksUserSession

  if (!userSession.isUserSignedIn()) {
    router.navigate(['home'])
  }

  return userSession.isUserSignedIn()
}
