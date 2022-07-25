import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Api} from "../shared/api.enum";

export class AuthInterceptor implements HttpInterceptor {
  private api = Api;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloned = req.clone({
      headers: req.headers.append(
        'Authorization', this.api.auth
      )
    });
    return next.handle(cloned)
  }
}
