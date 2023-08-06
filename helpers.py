import os

from flask import redirect, render_template, request, session
from functools import wraps

def apology(message, code=400, redirect_link="/"):
    """Render message as an apology to user."""
    return render_template("apology.html", top=code, bottom=message, redirect_link=redirect_link)


def login_apology(message, code=400, redirect_link="/login"):
    """Render message as an apology to user."""
    return render_template("loginapology.html", top=code, bottom=message, redirect_link=redirect_link)


# How to create login with user roles.
def login_required(role="ANY"):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    def wrapper(f):
        @wraps(f)
        def decorated_view(*args, **kwargs):

            if session.get("user_id") is None:
               return redirect("/login")
            urole = session.get("user_role")
            if (((urole != role) and (role != "ANY")) and ((urole == "User") and (role == "ANY ADMIN"))):
                return redirect("/login")  
            return f(*args, **kwargs)
        return decorated_view
    return wrapper