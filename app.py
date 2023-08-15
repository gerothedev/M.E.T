import os
import csv

from flask import Flask, redirect, render_template, request, session, jsonify, send_file
from flask_session import Session
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from datetime import date, datetime, timedelta
import qrcode
from PIL import Image, ImageDraw, ImageFont
import random, string

from helpers import login_required, apology, login_apology

UPLOAD_FOLDER = 'static/uploads/'
ALLOWED_EXTENSIONS = {'csv'}

app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['SESSION_COOKIE_NAME'] 
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("postgresql://postgres:198104@localhost:5432/met")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST"])
@login_required(role="ANY")
def index():

    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                        recent_activity.id, \
                                        equipment, \
                                        model, \
                                        serial, \
                                        ee, \
                                        (assigned_room || '-' || assigned_department) AS assigned_location, \
                                        date_added, \
                                        (added_first_name || ' ' || added_last_name) AS added_name, \
                                        repl_date, \
                                	    status, \
                                        (current_room || '-' || current_department) AS current_location, \
                                        scanned_first_name, \
                                        (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                        received_first_name, \
                                        (received_first_name || ' ' || received_last_name) AS received_name, \
                                        action, \
                                        date_of_action, \
                                        off_site_location, \
                                        point_of_contact, \
                                        phone_number, \
                                        (patient_first_name || ' ' || patient_last_name) AS patient_name \
                                   FROM inventory \
                                        JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                  WHERE qr_code = ? \
                                  ORDER BY inventory.id, recent_activity.id DESC", qr)

    in_use = db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                recent_activity.id, \
                                status \
                           FROM inventory \
                                JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                          ORDER BY inventory.id, recent_activity.id DESC")

    loaned = db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                recent_activity.id, \
                                status \
                           FROM inventory \
                                JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                          ORDER BY inventory.id, recent_activity.id DESC")

    off_site =db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                recent_activity.id, \
                                status \
                           FROM inventory \
                                JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                          ORDER BY inventory.id, recent_activity.id DESC")

    out_for_repair =db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                recent_activity.id, \
                                status \
                           FROM inventory \
                                JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                          ORDER BY inventory.id, recent_activity.id DESC")

    replace =db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                recent_activity.id, \
                                status \
                           FROM inventory \
                                JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                          ORDER BY inventory.id, recent_activity.id DESC")

    missing =db.execute("SELECT DISTINCT ON (inventory.id) inventory.id, \
                                recent_activity.id, \
                                status \
                           FROM inventory \
                                JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                          ORDER BY inventory.id, recent_activity.id DESC")

    
    in_use = [i for i in in_use if (i["status"] == "IN USE")]
    loaned = [i for i in loaned if (i["status"] == "LOANED")]
    off_site = [i for i in off_site if (i["status"] == "OFF-SITE")]
    out_for_repair = [i for i in out_for_repair if (i["status"] == "OUT FOR REPAIR")]
    replace = [i for i in replace if (i["status"] == "REPLACE")]
    missing = [i for i in missing if (i["status"] == "MISSING")]

    in_use = len(in_use)
    loaned = len(loaned)
    off_site = len(off_site)
    out_for_repair = len(out_for_repair)
    replace = len(replace)
    missing = len(missing)

    recents = db.execute("SELECT equipment, \
                                 qr_code, \
                                 status, \
                                 (current_room || '-' || current_department) AS current_location, \
                                 scanned_first_name, \
                                 (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                 received_first_name, \
                                 (received_first_name || ' ' || received_last_name) AS received_name, \
                                 action, \
                                 date_of_action, \
                                 off_site_location, \
                                 point_of_contact, \
                                 phone_number, \
                                 patient_first_name, \
                                 (patient_first_name || ' ' || patient_last_name) AS patient_name \
                            FROM recent_activity \
                                 JOIN inventory ON inventory.id = recent_activity.inventory_id \
                           ORDER BY recent_activity.id DESC \
                           LIMIT 100")

    if request.method == "POST":

        showinfo = {"equipment_name": equipment_info[0]["equipment"], 
                    "model": equipment_info[0]["model"], 
                    "serial": equipment_info[0]["serial"], 
                    "ee": equipment_info[0]["ee"],
                    "assigned_location": equipment_info[0]["assigned_location"],
                    "current_location": equipment_info[0]["current_location"], 
                    "status": equipment_info[0]["status"], 
                    "scanned_first_name": equipment_info[0]["scanned_first_name"], 
                    "scanned_name": equipment_info[0]["scanned_name"], 
                    "received_first_name": equipment_info[0]["received_first_name"], 
                    "received_name": equipment_info[0]["received_name"], 
                    "action": equipment_info[0]["action"], 
                    "date_of_action": equipment_info[0]["date_of_action"], 
                    "off_site_location": equipment_info[0]["off_site_location"], 
                    "point_of_contact": equipment_info[0]["point_of_contact"], 
                    "phone_number": equipment_info[0]["phone_number"], 
                    "patient_name": equipment_info[0]["patient_name"], 
                    "date_added": equipment_info[0]["date_added"],  
                    "added_name": equipment_info[0]["added_name"], 
                    "repl_date": equipment_info[0]["repl_date"]}

        return jsonify(showinfo)

    else:

        recents = [i for i in recents if (i["action"] != "NEW ITEM" or (i["action"] == "NEW ITEM" and i["status"] != "IN USE"))]

        return render_template("index.html", recents=recents, in_use=in_use, loaned=loaned, off_site=off_site, out_for_repair=out_for_repair, 
                           replace=replace, missing=missing)


@app.route("/admin_inventory", methods=["GET", "POST"])
@login_required(role="ANY ADMIN")
def admin_inventory():
    
    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location, \
                                           point_of_contact, \
                                           phone_number, \
                                           patient_first_name, \
                                           patient_last_name \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    
    depts = db.execute("SELECT * FROM department")
    rooms = db.execute("SELECT * FROM room")
    existingdepts = db.execute("SELECT * FROM department")
    existingrooms = db.execute("SELECT * FROM room")
    adept_id = 0
    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT DISTINCT ON (inventory.id) qr_code, \
                                        status  \
                                   FROM inventory \
                                        JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                  WHERE qr_code = ? \
                                  ORDER BY inventory.id, recent_activity.id DESC", qr)
    edit_fields = request.form.getlist("edit-field")
    edit_items = None
    edit_replace_date = request.form.get("edit-date-field")
    delete_qr = request.form.get("hidden-delete-item")
    archive_qr = request.form.get("hidden-archive-item")
    replace_qr = request.form.get("hidden-replace-item")
    missingitem = request.form.get("hiddenmissingitem")
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    status_filter = request.args.get("sf")
    filter_start_doa = ""
    filter_end_doa = ""
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    no_date_match = 0
    today = date.today().strftime("%Y-%m-%d") 
    date_format = "%Y-%m-%d"

    if request.method == "POST" and (request.form.get("invbutton") == "add" or request.form.get("invbutton") == "replace" or request.form.get("invbutton") == "missing" or 
    request.form.get("invbutton") == "delete" or (request.form.get("invbutton") == "edit" or request.form.get("invbutton") == "edit-single-item") or request.form.get("invbutton") == "archive"):

        if request.form.get("invbutton") == "edit":
            edit_items = request.form.getlist("editinv")
        elif request.form.get("invbutton") == "edit-single-item":
            edit_items = request.form.getlist("hidden-edit-item")
        
        replace_item = request.form.getlist("replaceinv")
        missing_items = request.form.getlist("missinginv")
        archive_items = request.form.getlist("archiveinv")
        delete_items = request.form.getlist("delinv")

        # Allows user to edit multiple inventory item information
        if edit_items:
            
            inventory_item = [None] * len(edit_items)
            
            if edit_replace_date:
                edit_replace_date = datetime.strptime(edit_replace_date, date_format)

            for i in range(len(edit_items)): 
                for j in range(len(inventory)): 
                    if edit_items[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]

            for i in range(len(inventory_item)):
                if edit_fields[i] != "":
                    break 
                if i == len(edit_fields) - 1:
                    return apology("At least one field must be changed.", 400, "/admin_inventory")
            
            for i in range(len(inventory_item)): 

                editinv = db.execute("SELECT equipment, model, serial, assigned_department FROM inventory WHERE qr_code = ?", inventory_item[i]["qr_code"])
                item_name = editinv[0]["equipment"]
                item_model = editinv[0]["model"]
                item_serial = editinv[0]["serial"]
                item_dept = editinv[0]["assigned_department"]
                adept_id = db.execute("SELECT id FROM department WHERE building = ?", item_dept)

                if edit_fields[0]:
                    edit_fields[0] = edit_fields[0].strip()
                    edit_fields[0] = edit_fields[0].upper()

                    db.execute("UPDATE inventory SET equipment = ? WHERE qr_code = ?", edit_fields[0], inventory_item[i]["qr_code"])

                if edit_fields[1]:
                    edit_fields[1] = edit_fields[1].strip()
                    edit_fields[1] = edit_fields[1].upper()
                    db.execute("UPDATE inventory SET model = ? WHERE qr_code = ?", edit_fields[1], inventory_item[i]["qr_code"])

                if edit_fields[2]:
                    edit_fields[2] = edit_fields[2].strip()
                    edit_fields[2] = edit_fields[2].upper()
                    db.execute("UPDATE inventory SET serial = ? WHERE qr_code = ?", edit_fields[2], inventory_item[i]["qr_code"])

                if edit_fields[3]:
                    edit_fields[3] = edit_fields[3].strip()
                    edit_fields[3] = edit_fields[3].upper()
                    db.execute("UPDATE inventory SET ee = ? WHERE qr_code = ?", edit_fields[3], inventory_item[i]["qr_code"])

                if edit_fields[4]:
                    edit_fields[4] = edit_fields[4].strip()
                    edit_fields[4] = edit_fields[4].upper()

                    if existingdepts:
                        for j in range(len(existingdepts)):
                            if existingdepts[j]["building"] == edit_fields[4]:
                                adept_id = db.execute("SELECT id FROM department WHERE building = ?", edit_fields[4])
                                break
                            elif j == len(existingdepts) - 1:
                                db.execute("INSERT INTO department (building) VALUES (?)", edit_fields[4])
                                adept_id = db.execute("SELECT id FROM department WHERE building = ?", edit_fields[4])
                    else:
                        db.execute("INSERT INTO department (building) VALUES (?)", edit_fields[4])
                        adept_id = db.execute("SELECT id FROM department WHERE building = ?", edit_fields[4])

                    db.execute("UPDATE inventory SET assigned_department = ? WHERE qr_code = ?", edit_fields[4], inventory_item[i]["qr_code"])

                if edit_fields[5]:
                    edit_fields[5] = edit_fields[5].strip()
                    edit_fields[5] = edit_fields[5].upper()

                    if existingrooms:
                        for j in range(len(existingrooms)):
                            if existingrooms[j]["rooms"] == edit_fields[5] and existingrooms[j]["department_id"] == adept_id[0]["id"]:
                                break
                            elif j == len(existingrooms) - 1:
                                db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", adept_id[0]['id'], edit_fields[5])
                    else:
                        db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", adept_id[0]['id'], edit_fields[5])

                    db.execute("UPDATE inventory SET assigned_room = ? WHERE qr_code = ?", edit_fields[5], inventory_item[i]["qr_code"])

                if edit_fields[6] != "Department":
                    edit_fields[6] = edit_fields[6].strip()
                    edit_fields[6] = edit_fields[6].upper()

                    db.execute("UPDATE inventory SET assigned_department = ? WHERE qr_code = ?", edit_fields[6], inventory_item[i]["qr_code"])

                if edit_fields[7] != "Room":
                    edit_fields[7] = edit_fields[7].strip()
                    edit_fields[7] = edit_fields[7].upper()

                    db.execute("UPDATE inventory SET assigned_room = ? WHERE qr_code = ?", edit_fields[7], inventory_item[i]["qr_code"])

                if edit_replace_date:
                    edit_date = edit_replace_date
                    edit_date = edit_date.strftime("%m/%d/%Y")
                    edit_date = edit_date.strip()
                    db.execute("UPDATE inventory SET repl_date = ? WHERE qr_code = ?", edit_date, inventory_item[i]["qr_code"])

                if edit_fields[0] or edit_fields[1] or edit_fields[2]:
                    os.remove(f"static/qrcodes/{inventory_item[i]['qr_code']}.png")

                    img = qrcode.make(inventory_item[i]["qr_code"])
                    type(img)  # qrcode.image.pil.PilImage
                    background = Image.new('RGBA', (290, 340), (255,255,255,255))
                    font = ImageFont.truetype("static/fonts/arial.ttf", 11)
                    draw = ImageDraw.Draw(background)
                    if edit_fields[0]:
                        draw.text((20,290), f"Equipment: {edit_fields[0]}", (0,0,0), font=font)
                    else:
                        draw.text((20,290), f"Equipment: {item_name}", (0,0,0), font=font)
                    if edit_fields[1]:
                        draw.text((20,305), f"Model: {edit_fields[1]}", (0,0,0), font=font)
                    else:
                        draw.text((20,305), f"Model: {item_model}", (0,0,0), font=font)
                    if edit_fields[2]:
                        draw.text((20,320), f"Serial: {edit_fields[2]}", (0,0,0), font=font)
                    else:
                        draw.text((20,320), f"Serial: {item_serial}", (0,0,0), font=font)
                    draw.rectangle(((270, 290), (290, 340)), fill="white")
                    background.paste(img, (0,1))
                    background.save(f"static/qrcodes/{inventory_item[i]['qr_code']}.png")

            return redirect("/admin_inventory")

        # Sends items marked by user to replace page
        elif replace_item:

            inventory_item = [None] * len(replace_item)

            for i in range(len(replace_item)): 
                for j in range(len(inventory)): 
                    if replace_item[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]

            for i in range(len(inventory_item)):
                if inventory_item[i]["status"] == "REPLACE" or inventory_item[i]["status"] == "REPLACED":
                    return apology("Item status is already set to replace or replaced.", 400, "/admin_inventory")

            for i in range(len(inventory_item)):
                if inventory_item[i]["action"] == "CHECKED OUT":
                    return apology("All items must be checked in.", 400, "/admin_inventory")
            
            for i in range(len(inventory_item)):
                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory_item[i]["current_department"]
                croom = inventory_item[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory_item[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/admin_inventory")
        
        # Sends items marked by user to missing page
        elif missing_items:

            inventory_item = [None] * len(missing_items)

            for i in range(len(missing_items)): 
                for j in range(len(inventory)): 
                    if missing_items[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]

            for i in range(len(inventory_item)):
                if inventory_item[i]["status"] == "MISSING":
                    return apology("Items already marked as missing.", 400, "/admin_inventory")

            for i in range(len(inventory_item)):
                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = "MISSING"
                cdept = inventory_item[i]["current_department"]
                croom = inventory_item[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory_item[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/admin_inventory")
        
        # Sends items marked by user to archive page
        elif archive_items:

            inventory_item = [None] * len(archive_items)

            for i in range(len(archive_items)): 
                for j in range(len(inventory)): 
                    if archive_items[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]

            for i in range(len(inventory_item)):
                if inventory_item[i]["status"] != "ARCHIVED":
                    return apology("Invalid status.", 400, "/admin_inventory")

            for i in range(len(inventory_item)):
                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = "ARCHIVED"
                cdept = inventory_item[i]["current_department"]
                croom = inventory_item[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory_item[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/admin_inventory")
        
        # Delete multiple items from inventory (likely only to be used for testing purposes)
        elif delete_items:

            inventory_item = [None] * len(delete_items)

            for i in range(len(delete_items)): 
                for j in range(len(inventory)): 
                    if delete_items[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]

            for i in range(len(inventory_item)):
                db.execute("DELETE FROM inventory WHERE qr_code = ?", inventory_item[i]["qr_code"])
                os.remove(f"static/qrcodes/{inventory_item[i]['qr_code']}.png")
            
            return redirect("/admin_inventory")

        # Add item to inventory
        else: 
            
            generateqr = "".join(random.choice(string.ascii_uppercase + string.digits) for i in range(10))

            for i in range(len(inventory)):
                
                if generateqr == inventory[i]["qr_code"]:
                    generateqr = "".join(random.choice(string.ascii_uppercase + string.digits) for i in range(10))
                    i = 0

            # Variables correspond to inventory table
            equipment = request.form.get("equipment")
            model = request.form.get("model")
            serial = request.form.get("serial")
            ee = request.form.get("ee")
            if request.form.get("dinput") and request.form.get("rinput"):
                adept = request.form.get("dinput")
                aroom = request.form.get("rinput")
            elif request.form.get("dselect") and request.form.get("rselect"):
                adept = request.form.get("dselect")
                aroom = request.form.get("rselect")
            qr_code = generateqr
            if request.form.get("date_added"):
                date_added = datetime.strptime(request.form.get("date_added"), date_format)
                date_added = date_added.strftime("%m/%d/%Y")
            added_by = db.execute("SELECT id FROM \"user\" WHERE id = ?", session["user_id"])
            added_by = added_by[0]["id"]
            added_first_name = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
            added_first_name = added_first_name[0]["first_name"]
            added_last_name = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
            added_last_name = added_last_name[0]["last_name"]
            if request.form.get("replace_date"):
                repl_date = datetime.strptime(request.form.get("replace_date"), date_format)
                repl_date = repl_date.strftime("%m/%d/%Y")

            if not equipment:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")
            elif not model:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")
            elif not serial:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")
            elif not ee:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")
            elif not adept:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")
            elif not aroom:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")
            elif not repl_date:
                return apology("Fields must not be empty/Please make a selection.", 400, "/admin_inventory")

            equipment = equipment.strip()
            equipment = equipment.upper()
            model = model.strip()
            model = model.upper()
            serial = serial.strip()
            serial = serial.upper()
            ee = ee.strip()
            ee = ee.upper()
            adept = adept.strip()
            adept = adept.upper()
            aroom = aroom.strip()
            aroom = aroom.upper()
            date_added = date_added.strip()
            repl_date = repl_date.strip()

            if existingdepts:
                for i in range(len(existingdepts)):
                    if existingdepts[i]["building"] == adept:
                        adept_id = db.execute("SELECT id FROM department WHERE building = ?", adept)
                        break
                    elif i == len(existingdepts) - 1:
                        db.execute("INSERT INTO department (building) VALUES (?)", adept)
                        adept_id = db.execute("SELECT id FROM department WHERE building = ?", adept)
            else:
                db.execute("INSERT INTO department (building) VALUES (?)", adept)
                adept_id = db.execute("SELECT id FROM department WHERE building = ?", adept)

            if existingrooms:
                for i in range(len(existingrooms)):
                    if existingrooms[i]["rooms"] == aroom and existingrooms[i]["department_id"] == adept_id[0]["id"]:
                        break
                    elif i == len(existingrooms) - 1:
                        db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", adept_id[0]['id'], aroom)
            else:
                db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", adept_id[0]['id'], aroom)

            db.execute("INSERT INTO inventory (equipment, model, serial, ee, assigned_department, assigned_room, qr_code, date_added, added_by, added_first_name, added_last_name, repl_date) \
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", equipment, model, serial, ee, adept, aroom, qr_code, date_added, added_by, added_first_name, added_last_name, repl_date)
            
            # Variables correspond to recent_activity table
            inventory_id = db.execute("SELECT id FROM inventory WHERE qr_code = ?", qr_code)
            inventory_id = inventory_id[0]["id"]
            status = "IN USE"
            cdept = adept
            croom = aroom
            employee_id = added_by
            sfn = added_first_name
            sln = added_last_name
            rfn = added_first_name
            rln = added_last_name
            action = "NEW ITEM"
            doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
            osl = "NA"
            poc = "NA"
            pn = "NA"
            pfn = "NA"
            pln = "NA"

            db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                       date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                       cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            img = qrcode.make(qr_code)
            type(img)  # qrcode.image.pil.PilImage
            background = Image.new('RGBA', (290, 340), (255,255,255,255))
            font = ImageFont.truetype("static/fonts/arial.ttf", 11)
            draw = ImageDraw.Draw(background)
            draw.text((20,290), f"Equipment: {equipment}", (0,0,0), font=font)
            draw.text((20,305), f"Model: {model}", (0,0,0), font=font)
            draw.text((20,320), f"Serial: {serial}", (0,0,0), font=font)
            draw.rectangle(((270, 290), (290, 340)), fill="white")
            background.paste(img, (0,1))
            background.save(f"static/qrcodes/{qr_code}.png")
            
            return redirect("/admin_inventory")
        
    # Allows user to delete item
    elif request.method == "POST" and delete_qr:

        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == delete_qr:
                db.execute("DELETE FROM inventory WHERE qr_code = ?", delete_qr)
                os.remove(f"static/qrcodes/{inventory[i]['qr_code']}.png")
        
        return redirect("/admin_inventory")
    
    elif request.method == "POST" and archive_qr:
        
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == archive_qr:
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "ARCHIVED"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/admin_inventory")

    elif request.method == "POST" and replace_qr:
        
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == replace_qr:

                if inventory[i]["status"] == "REPLACE" or inventory[i]["status"] == "REPLACED":
                    return apology("Item status is already set to replace or replaced.", 400, "/admin_inventory")
                
                if inventory[i]["action"] == "CHECKED OUT":
                    return apology("All items must be checked in.", 400, "/admin_inventory")

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/admin_inventory")

    # Allows user to mark item as 
    elif request.method == "POST" and missingitem:
        
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == missingitem:

                if inventory[i]["status"] == "MISSING":
                    return apology("Items already marked as missing.", 400, "/admin_inventory")

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "MISSING"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/admin_inventory")

    # Shows additional information    
    elif request.method == "POST" and qr:

        equipment_info = {"qr_code": equipment_info[0]["qr_code"],
                          "status": equipment_info[0]["status"]}

        return equipment_info

    # Return info based on filter selection
    elif request.method == "GET" and filters:
        
        # Automatically marks items to be replaced  
        for i in range(len(inventory)):
           if ((inventory[i]["repl_date"] == datetime.today().strftime("%m/%d/%Y")) or (datetime.strptime(inventory[i]["repl_date"], "%m/%d/%Y") < datetime.today())) \
                and (inventory[i]["action"] == "CHECKED IN" or inventory[i]["action"] == "NEW ITEM") and (inventory[i]["status"] != "REPLACE" and inventory[i]["status"] != "REPLACED" 
                and inventory[i]["status"] != "MISSING" and inventory[i]["status"] != "ARCHIVED"):

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = None
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)

        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]

        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] == "Location":
            if filters[5] != "Location":
                inventory = [i for i in inventory if (i["assigned_location"] == filters[5])]

        if filters[4] == "Department":
            if filters[6] != "Department":
                inventory = [i for i in inventory if (i["assigned_department"] == filters[6])]

        if filters[4] == "Room":
            if filters[7] != "Room":
                inventory = [i for i in inventory if (i["assigned_room"] == filters[7])]

        if filters[8] == "Location":
            if filters[9] != "Location":
                inventory = [i for i in inventory if (i["current_location"] == filters[9])]

        if filters[8] == "Department":
            if filters[10] != "Department":
                inventory = [i for i in inventory if (i["current_department"] == filters[10])]

        if filters[8] == "Room":
            if filters[11] != "Room":
                inventory = [i for i in inventory if (i["current_room"] == filters[11])]

        if filters[8] == "Off-site Location":
            if filters[12] != "Off-site Location":
                inventory = [i for i in inventory if (i["off_site_location"] == filters[12])]

        if filters[13] != "Status":
            inventory = [i for i in inventory if (i["status"] == filters[13])]

        if filters[14] != "Scanned By":
            if filters[14] == "NA":
                inventory = [i for i in inventory if (i["scanned_first_name"] == filters[14])]
            else:   
                inventory = [i for i in inventory if (i["scanned_name"] == filters[14])]

        if filters[15] != "Received By":
            if filters[15] == "NA":
                inventory = [i for i in inventory if (i["received_first_name"] == filters[15])]
            else:   
                inventory = [i for i in inventory if (i["received_name"] == filters[15])]

        if filters[16] != "Action":
            inventory = [i for i in inventory if (i["action"] == filters[16])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_doa = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_doa = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["doa"] >= filterdate[0] and inventory[i]["doa"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["doa"] >= filterdate[0] and i["doa"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_da = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_da = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[2] and inventory[i]["date_added"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[2] and i["date_added"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[17] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[17])]

        if filterdate[4] != "" and filterdate[5] != "":
            filterdate[4] = datetime.strptime(filterdate[4], date_format)
            filter_start_rd = filterdate[4].strftime(date_format)
            filterdate[4] = filterdate[4].strftime("%m/%d/%Y")
            filterdate[5] = datetime.strptime(filterdate[5], date_format)
            filter_end_rd = filterdate[5].strftime(date_format)
            filterdate[5] = filterdate[5].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[4] and inventory[i]["repl_date"] <= filterdate[5]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[4] and i["repl_date"] <= filterdate[5])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] != "ARCHIVED")]

        return render_template("admin_inventory.html", 
                               inventory=inventory, 
                               today=today, 
                               depts=depts, 
                               rooms=rooms, 
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3], 
                               filtersbal=filters[4],
                               filteral =filters[5],
                               filterad=filters[6],
                               filterar=filters[7],
                               filtersbcl=filters[8], 
                               filtercl=filters[9], 
                               filtercd= filters[10], 
                               filtercr= filters[11], 
                               filterosl = filters[12], 
                               filterstatus=filters[13], 
                               filtersb=filters[14], 
                               filterrb=filters[15],
                               filteraction=filters[16], 
                               filter_start_doa=filter_start_doa,  
                               filter_end_doa=filter_end_doa, 
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[17], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)

    elif request.method == "GET" and status_filter:

        # Automatically marks items to be replaced  
        for i in range(len(inventory)):
            if ((inventory[i]["repl_date"] == datetime.today().strftime("%m/%d/%Y")) or (datetime.strptime(inventory[i]["repl_date"], "%m/%d/%Y") < datetime.today())) \
                and (inventory[i]["action"] == "CHECKED IN" or inventory[i]["action"] == "NEW ITEM") and (inventory[i]["status"] != "REPLACE" and inventory[i]["status"] != "REPLACED" 
                and inventory[i]["status"] != "MISSING" and inventory[i]["status"] != "ARCHIVED"):

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = None
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)

        inventory = [i for i in inventory if (i["status"] == status_filter)]
        inventory = [i for i in inventory if (i["status"] != "ARCHIVED")]

        return render_template("admin_inventory.html", inventory=inventory, today=today, depts=depts, rooms=rooms, filterstatus=status_filter)

    # Renders inventory page and automatically marks items to be replaced  
    else: 

        for i in range(len(inventory)):
            if ((inventory[i]["repl_date"] == datetime.today().strftime("%m/%d/%Y")) or (datetime.strptime(inventory[i]["repl_date"], "%m/%d/%Y") < datetime.today())) \
                and (inventory[i]["action"] == "CHECKED IN" or inventory[i]["action"] == "NEW ITEM") and (inventory[i]["status"] != "REPLACE" and inventory[i]["status"] != "REPLACED" 
                and inventory[i]["status"] != "MISSING" and inventory[i]["status"] != "ARCHIVED"):

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = None
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
                
        inventory = [i for i in inventory if (i["status"] != "ARCHIVED")]
        
        return render_template("admin_inventory.html", inventory=inventory, today=today, depts=depts, rooms=rooms)
    

@app.route("/inventory", methods=["GET", "POST"])
@login_required(role="User")
def inventory():
    
    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    status_filter = request.args.get("sf")
    filter_start_doa = ""
    filter_end_doa = ""
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    no_date_match = 0 
    date_format = "%Y-%m-%d"

    # Return info based on filter selection
    if request.method == "GET" and filters:
        
        # Automatically marks items to be replaced  
        for i in range(len(inventory)):
           if ((inventory[i]["repl_date"] == datetime.today().strftime("%m/%d/%Y")) or (datetime.strptime(inventory[i]["repl_date"], "%m/%d/%Y") < datetime.today())) \
                and (inventory[i]["action"] == "CHECKED IN" or inventory[i]["action"] == "NEW ITEM") and (inventory[i]["status"] != "REPLACE" and inventory[i]["status"] != "REPLACED" 
                and inventory[i]["status"] != "MISSING" and inventory[i]["status"] != "ARCHIVED"):

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = None
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)

        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]

        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] == "Location":
            if filters[5] != "Location":
                inventory = [i for i in inventory if (i["assigned_location"] == filters[5])]

        if filters[4] == "Department":
            if filters[6] != "Department":
                inventory = [i for i in inventory if (i["assigned_department"] == filters[6])]

        if filters[4] == "Room":
            if filters[7] != "Room":
                inventory = [i for i in inventory if (i["assigned_room"] == filters[7])]

        if filters[8] == "Location":
            if filters[9] != "Location":
                inventory = [i for i in inventory if (i["current_location"] == filters[9])]

        if filters[8] == "Department":
            if filters[10] != "Department":
                inventory = [i for i in inventory if (i["current_department"] == filters[10])]

        if filters[8] == "Room":
            if filters[11] != "Room":
                inventory = [i for i in inventory if (i["current_room"] == filters[11])]

        if filters[8] == "Off-site Location":
            if filters[12] != "Off-site Location":
                inventory = [i for i in inventory if (i["off_site_location"] == filters[12])]

        if filters[13] != "Status":
            inventory = [i for i in inventory if (i["status"] == filters[13])]

        if filters[14] != "Scanned By":
            if filters[14] == "NA":
                inventory = [i for i in inventory if (i["scanned_first_name"] == filters[14])]
            else:   
                inventory = [i for i in inventory if (i["scanned_name"] == filters[14])]

        if filters[15] != "Received By":
            if filters[15] == "NA":
                inventory = [i for i in inventory if (i["received_first_name"] == filters[15])]
            else:   
                inventory = [i for i in inventory if (i["received_name"] == filters[15])]

        if filters[16] != "Action":
            inventory = [i for i in inventory if (i["action"] == filters[16])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_doa = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_doa = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["doa"] >= filterdate[0] and inventory[i]["doa"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["doa"] >= filterdate[0] and i["doa"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_da = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_da = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[2] and inventory[i]["date_added"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[2] and i["date_added"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[17] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[17])]

        if filterdate[4] != "" and filterdate[5] != "":
            filterdate[4] = datetime.strptime(filterdate[4], date_format)
            filter_start_rd = filterdate[4].strftime(date_format)
            filterdate[4] = filterdate[4].strftime("%m/%d/%Y")
            filterdate[5] = datetime.strptime(filterdate[5], date_format)
            filter_end_rd = filterdate[5].strftime(date_format)
            filterdate[5] = filterdate[5].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[4] and inventory[i]["repl_date"] <= filterdate[5]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[4] and i["repl_date"] <= filterdate[5])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] != "ARCHIVED")]

        return render_template("inventory.html", 
                               inventory=inventory,
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3], 
                               filtersbal=filters[4],
                               filteral =filters[5],
                               filterad=filters[6],
                               filterar=filters[7],
                               filtersbcl=filters[8], 
                               filtercl=filters[9], 
                               filtercd= filters[10], 
                               filtercr= filters[11], 
                               filterosl = filters[12], 
                               filterstatus=filters[13], 
                               filtersb=filters[14], 
                               filterrb=filters[15],
                               filteraction=filters[16], 
                               filter_start_doa=filter_start_doa,  
                               filter_end_doa=filter_end_doa, 
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[17], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)

    elif request.method == "GET" and status_filter:

        # Automatically marks items to be replaced  
        for i in range(len(inventory)):
            if ((inventory[i]["repl_date"] == datetime.today().strftime("%m/%d/%Y")) or (datetime.strptime(inventory[i]["repl_date"], "%m/%d/%Y") < datetime.today())) \
                and (inventory[i]["action"] == "CHECKED IN" or inventory[i]["action"] == "NEW ITEM") and (inventory[i]["status"] != "REPLACE" and inventory[i]["status"] != "REPLACED" 
                and inventory[i]["status"] != "MISSING" and inventory[i]["status"] != "ARCHIVED"):

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = None
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)

        inventory = [i for i in inventory if (i["status"] == status_filter)]
        inventory = [i for i in inventory if (i["status"] != "ARCHIVED")]

        return render_template("inventory.html", inventory=inventory, filterstatus=status_filter)
    
    # Renders inventory page and automatically marks items to be replaced  
    else: 

        # Automatically marks items to be replaced  
        for i in range(len(inventory)):
            if ((inventory[i]["repl_date"] == datetime.today().strftime("%m/%d/%Y")) or (datetime.strptime(inventory[i]["repl_date"], "%m/%d/%Y") < datetime.today())) \
                and (inventory[i]["action"] == "CHECKED IN" or inventory[i]["action"] == "NEW ITEM") and (inventory[i]["status"] != "REPLACE" and inventory[i]["status"] != "REPLACED" 
                and inventory[i]["status"] != "MISSING" and inventory[i]["status"] != "ARCHIVED"):

                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACE"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = None
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)

        inventory = [i for i in inventory if (i["status"] != "ARCHIVED")]
        
        return render_template("inventory.html", inventory=inventory)


@app.route("/off-site", methods=["GET", "POST"])
@login_required(role="ANY")
def off_site():

    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location, \
                                           point_of_contact, \
                                           phone_number, \
                                           patient_first_name, \
                                           patient_last_name, \
                                           (patient_first_name || ' ' || patient_last_name) AS patient_name \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT qr_code FROM inventory WHERE qr_code = ?", qr)
    missingitem =  request.form.get("hiddenmissingitem")
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    filter_start_doa = ""
    filter_end_doa = ""
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    no_date_match = 0
    date_format = "%Y-%m-%d"
    
    if request.method == "POST" and qr:

        equipment_info = {"qr_code": equipment_info[0]["qr_code"]}

        return equipment_info
    
    elif request.method == "POST" and request.form.get("invbutton") == "missing":
    # Sends items marked by user to missing page

        missing_items = request.form.getlist("missinginv")

        inventory_item = [None] * len(missing_items)

        for i in range(len(missing_items)): 
            for j in range(len(inventory)): 
                if missing_items[i] == inventory[j]["qr_code"]:
                    inventory_item[i] = inventory[j]

        for i in range(len(inventory_item)):
            if inventory_item[i]["status"] == "MISSING":
                return apology("Items already marked as missing.", 400, "/admin_inventory")

        for i in range(len(inventory_item)):
            # Variables correspond to recent_activity table
            inventory_id = inventory_item[i]["equipment_id"]
            status = "MISSING"
            cdept = inventory_item[i]["current_department"]
            croom = inventory_item[i]["current_room"]
            employee_id = session["user_id"]
            sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
            sfn = sfn[0]["first_name"]
            sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
            sln = sln[0]["last_name"]
            rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
            rfn = rfn[0]["first_name"]
            rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
            rln = rln[0]["last_name"]
            action = inventory_item[i]["action"]
            doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
            osl = "NA"
            poc = "NA"
            pn = "NA"
            pfn = "NA"
            pln = "NA"

            db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
        
        return redirect("/off-site")

    elif request.method == "POST" and missingitem:
    
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == missingitem:
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "MISSING"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/off-site")
        
    elif request.method == "GET" and filters:
        
        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]\
            
        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] != "Off-site Location":
            inventory = [i for i in inventory if (i["off_site_location"] == filters[4])]

        if filters[5] != "Scanned By":
            if filters[5] == "NA":
                inventory = [i for i in inventory if (i["scanned_first_name"] == filters[5])]
            else:   
                inventory = [i for i in inventory if (i["scanned_name"] == filters[5])]

        if filters[6] != "Received By":
            if filters[6] == "NA":
                inventory = [i for i in inventory if (i["received_first_name"] == filters[6])]
            else:   
                inventory = [i for i in inventory if (i["received_name"] == filters[6])]

        if filters[7] != "Action":
            inventory = [i for i in inventory if (i["action"] == filters[7])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_doa = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_doa = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["doa"] >= filterdate[0] and inventory[i]["doa"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["doa"] >= filterdate[0] and i["doa"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1
        
        if filters[8] != "Point of Contact":
            inventory = [i for i in inventory if (i["point_of_contact"] == filters[8])]

        if filters[9] != "Phone Number":
            inventory = [i for i in inventory if (i["phone_number"] == filters[9])]

        if filters[10] != "Patient Name":
            inventory = [i for i in inventory if (i["patient_name"] == filters[10])]

        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_da = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_da = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[2] and inventory[i]["date_added"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[2] and i["date_added"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[11] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[11])]

        if filterdate[4] != "" and filterdate[5] != "":
            filterdate[4] = datetime.strptime(filterdate[4], date_format)
            filter_start_rd = filterdate[4].strftime(date_format)
            filterdate[4] = filterdate[4].strftime("%m/%d/%Y")
            filterdate[5] = datetime.strptime(filterdate[5], date_format)
            filter_end_rd = filterdate[5].strftime(date_format)
            filterdate[5] = filterdate[5].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[4] and inventory[i]["repl_date"] <= filterdate[5]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[4] and i["repl_date"] <= filterdate[5])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] == "OFF-SITE")]

        return render_template("off-site.html", 
                               inventory=inventory, 
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3],
                               filterosl = filters[4],
                               filtersb=filters[5], 
                               filterrb=filters[6],
                               filteraction=filters[7], 
                               filter_start_doa=filter_start_doa,  
                               filter_end_doa=filter_end_doa, 
                               filterpoc=filters[8], 
                               filterpn=filters[9], 
                               filterpatient=filters[10], 
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[11], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)
    
    else:
    
        inventory = [i for i in inventory if (i["status"] == "OFF-SITE")]

        return render_template("off-site.html", inventory=inventory)


@app.route("/replace", methods=["GET", "POST"])
@login_required(role="ANY")
def replace():

    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location, \
                                           point_of_contact, \
                                           phone_number, \
                                           patient_first_name, \
                                           patient_last_name \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT qr_code FROM inventory WHERE qr_code = ?", qr)
    replaced_qr = request.form.get("hidden-replaced-item")
    missingitem =  request.form.get("hiddenmissingitem")
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    filter_start_doa = ""
    filter_end_doa = ""
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    no_date_match = 0
    date_format = "%Y-%m-%d"
    
    if request.method == "POST" and request.form.get("invbutton") == "replaced":

        replacedinv = request.form.getlist("replacedinv")

        # Send items to replaced items page
        if replacedinv:

            inventory_item = [None] * len(replacedinv)

            for i in range(len(replacedinv)): 
                for j in range(len(inventory)): 
                    if replacedinv[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]

            for i in range(len(inventory_item)):
                if inventory_item[i]["action"] == "CHECKED OUT":
                    return apology("All items must be checked in.", 400, "/replaced")
            
            for i in range(len(inventory_item)):
                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = "REPLACED"
                cdept = inventory_item[i]["current_department"]
                croom = inventory_item[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory_item[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/replace")
        
        elif not replacedinv:
            return apology("Please make a selection.", 400, "/replace")
        
    # Sends items marked by user to missing page
    elif request.method == "POST" and request.form.get("invbutton") == "missing":

        missing_items = request.form.getlist("missinginv")

        inventory_item = [None] * len(missing_items)

        for i in range(len(missing_items)): 
            for j in range(len(inventory)): 
                if missing_items[i] == inventory[j]["qr_code"]:
                    inventory_item[i] = inventory[j]

        for i in range(len(inventory_item)):
            if inventory_item[i]["status"] == "MISSING":
                return apology("Items already marked as missing.", 400, "/admin_inventory")

        for i in range(len(inventory_item)):
            # Variables correspond to recent_activity table
            inventory_id = inventory_item[i]["equipment_id"]
            status = "MISSING"
            cdept = inventory_item[i]["current_department"]
            croom = inventory_item[i]["current_room"]
            employee_id = session["user_id"]
            sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
            sfn = sfn[0]["first_name"]
            sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
            sln = sln[0]["last_name"]
            rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
            rfn = rfn[0]["first_name"]
            rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
            rln = rln[0]["last_name"]
            action = inventory_item[i]["action"]
            doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
            osl = "NA"
            poc = "NA"
            pn = "NA"
            pfn = "NA"
            pln = "NA"

            db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
        
        return redirect("/replace")

    elif request.method == "POST" and qr:

        equipment_info = {"qr_code": equipment_info[0]["qr_code"]}

        return equipment_info
    
    elif request.method == "POST" and replaced_qr:
    
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == replaced_qr:
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACED"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/replace")
    
    elif request.method == "POST" and missingitem:
    
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == missingitem:
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "MISSING"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/replace")

    # Return info based on filter selection
    elif request.method == "GET" and filters:
        
        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]

        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] == "Location":
            if filters[5] != "Location":
                inventory = [i for i in inventory if (i["assigned_location"] == filters[5])]

        if filters[4] == "Department":
            if filters[6] != "Department":
                inventory = [i for i in inventory if (i["assigned_department"] == filters[6])]

        if filters[4] == "Room":
            if filters[7] != "Room":
                inventory = [i for i in inventory if (i["assigned_room"] == filters[7])]

        if filters[8] == "Location":
            if filters[9] != "Location":
                inventory = [i for i in inventory if (i["current_location"] == filters[9])]

        if filters[8] == "Department":
            if filters[10] != "Department":
                inventory = [i for i in inventory if (i["current_department"] == filters[10])]

        if filters[8] == "Room":
            if filters[11] != "Room":
                inventory = [i for i in inventory if (i["current_room"] == filters[11])]

        if filters[12] != "Scanned By":
            if filters[12] == "NA":
                inventory = [i for i in inventory if (i["scanned_first_name"] == filters[12])]
            else:   
                inventory = [i for i in inventory if (i["scanned_name"] == filters[12])]

        if filters[13] != "Received By":
            if filters[13] == "NA":
                inventory = [i for i in inventory if (i["received_first_name"] == filters[13])]
            else:   
                inventory = [i for i in inventory if (i["received_name"] == filters[13])]

        if filters[14] != "Action":
            inventory = [i for i in inventory if (i["action"] == filters[14])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_doa = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_doa = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["doa"] >= filterdate[0] and inventory[i]["doa"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["doa"] >= filterdate[0] and i["doa"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1
        
        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_da = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_da = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[2] and inventory[i]["date_added"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[2] and i["date_added"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[15] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[15])]

        if filterdate[4] != "" and filterdate[5] != "":
            filterdate[4] = datetime.strptime(filterdate[4], date_format)
            filter_start_rd = filterdate[4].strftime(date_format)
            filterdate[4] = filterdate[4].strftime("%m/%d/%Y")
            filterdate[5] = datetime.strptime(filterdate[5], date_format)
            filter_end_rd = filterdate[5].strftime(date_format)
            filterdate[5] = filterdate[5].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[4] and inventory[i]["repl_date"] <= filterdate[5]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[4] and i["repl_date"] <= filterdate[5])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] == "REPLACE")]

        return render_template("replace.html", 
                               inventory=inventory, 
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3], 
                               filtersbal=filters[4],
                               filteral=filters[5],
                               filterad=filters[6],
                               filterar=filters[7],
                               filtersbcl=filters[8], 
                               filtercl=filters[9], 
                               filtercd=filters[10], 
                               filtercr=filters[11], 
                               filtersb=filters[12], 
                               filterrb=filters[13],
                               filteraction=filters[14], 
                               filter_start_doa=filter_start_doa,  
                               filter_end_doa=filter_end_doa, 
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[15], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)
    
    inventory = [i for i in inventory if (i["status"] == "REPLACE")]

    return render_template("replace.html", inventory=inventory)


@app.route("/replaced_items", methods=["GET", "POST"])
@login_required(role="ANY")
def replaced_items():

    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location, \
                                           point_of_contact, \
                                           phone_number, \
                                           patient_first_name, \
                                           patient_last_name \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT qr_code FROM inventory WHERE qr_code = ?", qr)
    archive_qr = request.form.get("hidden-archive-item")
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    filter_start_doa = ""
    filter_end_doa = ""
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    no_date_match = 0
    date_format = "%Y-%m-%d"
    
    if request.method == "POST" and request.form.get("invbutton") == "archive":

        archive_items = request.form.getlist("archiveinv")

        # Sends items marked by user to archive page
        if archive_items:

            inventory_item = [None] * len(archive_items)

            for i in range(len(archive_items)): 
                for j in range(len(inventory)): 
                    if archive_items[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]
            
            for i in range(len(inventory_item)):
                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = "ARCHIVED"
                cdept = inventory_item[i]["current_department"]
                croom = inventory_item[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory_item[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/archive")

    elif request.method == "POST" and qr:

        equipment_info = {"qr_code": equipment_info[0]["qr_code"]}

        return equipment_info
    
    # Send single item to archive
    elif request.method == "POST" and archive_qr:
        
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == archive_qr:
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "ARCHIVED"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/replaced_items")
            
    # Return info based on filter selection
    elif request.method == "GET" and filters:
        
        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]

        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] == "Location":
            if filters[5] != "Location":
                inventory = [i for i in inventory if (i["assigned_location"] == filters[5])]

        if filters[4] == "Department":
            if filters[6] != "Department":
                inventory = [i for i in inventory if (i["assigned_department"] == filters[6])]

        if filters[4] == "Room":
            if filters[7] != "Room":
                inventory = [i for i in inventory if (i["assigned_room"] == filters[7])]

        if filters[8] == "Location":
            if filters[9] != "Location":
                inventory = [i for i in inventory if (i["current_location"] == filters[9])]

        if filters[8] == "Department":
            if filters[10] != "Department":
                inventory = [i for i in inventory if (i["current_department"] == filters[10])]

        if filters[8] == "Room":
            if filters[11] != "Room":
                inventory = [i for i in inventory if (i["current_room"] == filters[11])]

        if filters[12] != "Scanned By":
            if filters[12] == "NA":
                inventory = [i for i in inventory if (i["scanned_first_name"] == filters[12])]
            else:   
                inventory = [i for i in inventory if (i["scanned_name"] == filters[12])]

        if filters[13] != "Received By":
            if filters[13] == "NA":
                inventory = [i for i in inventory if (i["received_first_name"] == filters[13])]
            else:   
                inventory = [i for i in inventory if (i["received_name"] == filters[13])]

        if filters[14] != "Action":
            inventory = [i for i in inventory if (i["action"] == filters[14])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_doa = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_doa = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["doa"] >= filterdate[0] and inventory[i]["doa"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["doa"] >= filterdate[0] and i["doa"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1
        
        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_da = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_da = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[2] and inventory[i]["date_added"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[2] and i["date_added"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[15] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[15])]

        if filterdate[4] != "" and filterdate[5] != "":
            filterdate[4] = datetime.strptime(filterdate[4], date_format)
            filter_start_rd = filterdate[4].strftime(date_format)
            filterdate[4] = filterdate[4].strftime("%m/%d/%Y")
            filterdate[5] = datetime.strptime(filterdate[5], date_format)
            filter_end_rd = filterdate[5].strftime(date_format)
            filterdate[5] = filterdate[5].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[4] and inventory[i]["repl_date"] <= filterdate[5]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[4] and i["repl_date"] <= filterdate[5])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] == "REPLACED")]

        return render_template("replaced_items.html", 
                               inventory=inventory, 
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3], 
                               filtersbal=filters[4],
                               filteral =filters[5],
                               filterad=filters[6],
                               filterar=filters[7],
                               filtersbcl=filters[8], 
                               filtercl=filters[9], 
                               filtercd= filters[10], 
                               filtercr= filters[11], 
                               filtersb=filters[12], 
                               filterrb=filters[13],
                               filteraction=filters[14], 
                               filter_start_doa=filter_start_doa,  
                               filter_end_doa=filter_end_doa, 
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[15], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)
    
    else:

        # Automatically sends items to archive
        replace_dates = [i for i in inventory if (i["status"] == "REPLACED")]

        for i in range(len(replace_dates)):
            days_passed = datetime.strptime(datetime.today().strftime("%m/%d/%Y"),"%m/%d/%Y") - datetime.strptime(replace_dates[i]["doa"], "%m/%d/%Y")
            if (days_passed.days) >= 180:
                # Variables correspond to recent_activity table
                inventory_id = replace_dates[i]["equipment_id"]
                status = "ARCHIVED"
                cdept = replace_dates[i]["current_department"]
                croom = replace_dates[i]["current_room"]
                employee_id = session["user_id"]
                sfn = "NA"
                sln = "NA"
                rfn = "NA"
                rln = "NA"
                action = replace_dates[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)


        inventory = [i for i in inventory if (i["status"] == "REPLACED")]
        
        return render_template("replaced_items.html", inventory=inventory)


@app.route("/missing", methods=["GET", "POST"])
@login_required(role="ANY")
def missing():

    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location, \
                                           point_of_contact, \
                                           phone_number, \
                                           patient_first_name, \
                                           patient_last_name, \
                                           (patient_first_name || ' ' || patient_last_name) AS patient_name \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT qr_code FROM inventory WHERE qr_code = ?", qr)
    replaced_qr = request.form.get("hidden-replaced-item")
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    filter_start_doa = ""
    filter_end_doa = ""
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    no_date_match = 0
    date_format = "%Y-%m-%d"
    
    if request.method == "POST" and qr:

        equipment_info = {"qr_code": equipment_info[0]["qr_code"]}

        return equipment_info

    if request.method == "POST" and request.form.get("invbutton") == "replaced":

        replacedinv = request.form.getlist("replacedinv")

        # Send items to replaced items page
        if replacedinv:

            inventory_item = [None] * len(replacedinv)

            for i in range(len(replacedinv)): 
                for j in range(len(inventory)): 
                    if replacedinv[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]
            
            for i in range(len(inventory_item)):
                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = "REPLACED"
                cdept = inventory_item[i]["current_department"]
                croom = inventory_item[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory_item[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = "NA"
                poc = "NA"
                pn = "NA"
                pfn = "NA"
                pln = "NA"

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/replaced_items")
    
    elif request.method == "POST" and replaced_qr:
    
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == replaced_qr:
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = "REPLACED"
                cdept = inventory[i]["current_department"]
                croom = inventory[i]["current_room"]
                employee_id = session["user_id"]
                sfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                sfn = sfn[0]["first_name"]
                sln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                sln = sln[0]["last_name"]
                rfn = db.execute("SELECT first_name FROM \"user\" WHERE id = ?", session["user_id"])
                rfn = rfn[0]["first_name"]
                rln = db.execute("SELECT last_name FROM \"user\" WHERE id = ?", session["user_id"])
                rln = rln[0]["last_name"]
                action = inventory[i]["action"]
                doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
                osl = inventory[i]["off_site_location"]
                poc = inventory[i]["point_of_contact"]
                pn = inventory[i]["phone_number"]
                pfn = inventory[i]["patient_first_name"]
                pln = inventory[i]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/missing")
    
    elif request.method == "GET" and filters:
        
        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]

        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] == "Location":
            if filters[5] != "Location":
                inventory = [i for i in inventory if (i["assigned_location"] == filters[5])]

        if filters[4] == "Department":
            if filters[6] != "Department":
                inventory = [i for i in inventory if (i["assigned_department"] == filters[6])]

        if filters[4] == "Room":
            if filters[7] != "Room":
                inventory = [i for i in inventory if (i["assigned_room"] == filters[7])]

        if filters[8] == "Location":
            if filters[9] != "Location":
                inventory = [i for i in inventory if (i["current_location"] == filters[9])]

        if filters[8] == "Department":
            if filters[10] != "Department":
                inventory = [i for i in inventory if (i["current_department"] == filters[10])]

        if filters[8] == "Room":
            if filters[11] != "Room":
                inventory = [i for i in inventory if (i["current_room"] == filters[11])]

        if filters[8] == "Off-site Location":
            if filters[12] != "Off-site Location":
                inventory = [i for i in inventory if (i["off_site_location"] == filters[12])]

        if filters[13] != "Scanned By":
            if filters[13] == "NA":
                inventory = [i for i in inventory if (i["scanned_first_name"] == filters[13])]
            else:   
                inventory = [i for i in inventory if (i["scanned_name"] == filters[13])]

        if filters[14] != "Received By":
            if filters[14] == "NA":
                inventory = [i for i in inventory if (i["received_first_name"] == filters[14])]
            else:   
                inventory = [i for i in inventory if (i["received_name"] == filters[14])]

        if filters[15] != "Action":
            inventory = [i for i in inventory if (i["action"] == filters[15])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_doa = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_doa = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["doa"] >= filterdate[0] and inventory[i]["doa"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["doa"] >= filterdate[0] and i["doa"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1
        
        if filters[16] != "Point of Contact":
            inventory = [i for i in inventory if (i["point_of_contact"] == filters[16])]

        if filters[17] != "Phone Number":
            inventory = [i for i in inventory if (i["phone_number"] == filters[17])]

        if filters[18] != "Patient Name":
            if filters[18] == "NA":
                inventory = [i for i in inventory if (i["patient_first_name"] == filters[18])]
            else:   
                inventory = [i for i in inventory if (i["patient_name"] == filters[18])]
        
        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_da = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_da = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[2] and inventory[i]["date_added"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[2] and i["date_added"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[19] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[19])]

        if filterdate[4] != "" and filterdate[5] != "":
            filterdate[4] = datetime.strptime(filterdate[4], date_format)
            filter_start_rd = filterdate[4].strftime(date_format)
            filterdate[4] = filterdate[4].strftime("%m/%d/%Y")
            filterdate[5] = datetime.strptime(filterdate[5], date_format)
            filter_end_rd = filterdate[5].strftime(date_format)
            filterdate[5] = filterdate[5].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[4] and inventory[i]["repl_date"] <= filterdate[5]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[4] and i["repl_date"] <= filterdate[5])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] == "MISSING")]

        return render_template("missing.html", 
                               inventory=inventory, 
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3], 
                               filtersbal=filters[4],
                               filteral =filters[5],
                               filterad=filters[6],
                               filterar=filters[7],
                               filtersbcl=filters[8], 
                               filtercl=filters[9], 
                               filtercd= filters[10], 
                               filtercr= filters[11], 
                               filterosl = filters[12],
                               filtersb=filters[13], 
                               filterrb=filters[14],
                               filteraction=filters[15], 
                               filter_start_doa=filter_start_doa,  
                               filter_end_doa=filter_end_doa, 
                               filterpoc=filters[16], 
                               filterpn=filters[17], 
                               filterpatient=filters[18], 
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[19], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)
    
    else:
    
        inventory = [i for i in inventory if (i["status"] == "MISSING")]

        return render_template("missing.html", inventory=inventory)
        

@app.route("/search", methods=["GET", "POST"])
@login_required(role="ANY")
def search():

    depts = db.execute("SELECT * FROM department ORDER BY building ASC")
    rooms = db.execute("SELECT * FROM room ORDER BY rooms ASC")
    osl = db.execute("SELECT * FROM off_site_location ORDER BY location ASC")
    statuses = ["In Use", "Storage", "Loaned", "Off-site", "Out for Repair", "Replace", "Replaced", "Missing", "Archived"]
    action = ["Checked In", "Checked Out", "New Item"]
    selection = ["Equipment", "Model", "Serial", "EE", "Status", "Assigned Location", "Current Location", "Off-site Location", "Scanned By", "Received By", "Action", "Date of Action"]
    fieldname = request.args.get("search_by")
    showtable = 0

    if fieldname or request.args.get("s"):
    
        fields = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           scanned_first_name, \
					                       scanned_last_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           received_last_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")

        # Search for equipment, model, serial, ee
        if  fieldname == selection[0] or fieldname == selection[1] or fieldname == selection[2] or fieldname == selection[3]:

            fieldname = fieldname.lower()
            search = request.args.get("s")

            search = search.strip()
            search = search.upper()

            fields = [i for i in fields if (i[fieldname] == search)]

        elif fieldname == selection[4]:

            status = request.args.get("s")
            status = status.upper()

            fields = [i for i in fields if (i["status"] == status)]

        # Search for equipment, model, serial, ee
        elif fieldname == selection[5]:

            location = request.args.getlist("s")

            fields = [i for i in fields if (i["assigned_department"] == location[0] and i["assigned_room"] == location[1])]

        elif fieldname == selection[6]:

            location = request.args.getlist("s")

            fields = [i for i in fields if (i["current_department"] == location[0] and i["current_room"] == location[1])]

        elif fieldname == selection[7]:

            off_site_location = request.args.get("s")

            fields = [i for i in fields if (i["off_site_location"] == off_site_location)]

        elif fieldname == selection[8]:

            name = request.args.getlist("s")
            
            sfn = name[0].capitalize()
            sln = name[1].capitalize()
            sfn = sfn.strip()
            sln = sln.strip()

            user = db.execute("SELECT id FROM \"user\" where first_name = ? AND last_name = ?", sfn, sln)

            fields = [i for i in fields if (i["employee_id"] == user[0]["id"])]

        elif fieldname == selection[9]:

            name = request.args.getlist("s")
            
            rfn = name[0].capitalize()
            rln = name[1].capitalize()
            rfn = rfn.strip()
            rln = rln.strip()

            fields = [i for i in fields if (i["received_first_name"] == rfn and i["received_last_name"] == rln)]


        elif fieldname == selection[10]:

            checkaction = request.args.get("s")
            checkaction = checkaction.upper()
            
            fields = [i for i in fields if (i["action"] == checkaction)]

        elif fieldname == selection[11]:
            if request.args.get("s"):
                date_of_action = request.args.get("s")
                date_format = "%Y-%m-%d"
                date_of_action = datetime.strptime(date_of_action, date_format)
                date_of_action = date_of_action.strftime("%m/%d/%Y")

            fields = [i for i in fields if (i["doa"] == date_of_action)]

        else:
            showtable = 3
            return render_template("search.html", showtable=showtable, depts=depts, rooms=rooms,  osl=osl, statuses=statuses, action=action) 

        if not fields:
            showtable = 2
        else:
            showtable = 1
        
        return render_template("search.html", fields=fields, showtable=showtable, depts=depts, rooms=rooms, osl=osl, statuses=statuses, action=action)
    
    elif request.args.get("s") == "": 
        showtable = 3
        return render_template("search.html", showtable=showtable, depts=depts, rooms=rooms, osl=osl, statuses=statuses, action=action) 
    
    else:

        return render_template("search.html", depts=depts, rooms=rooms, osl=osl, statuses=statuses, action=action, showtable=showtable)


@app.route("/archive", methods=["GET", "POST"])
@login_required(role="ANY")
def archive():

    inventory = db.execute("SELECT * \
                              FROM (SELECT DISTINCT ON (inventory.id) \
                                           inventory.id AS equipment_id, \
                                           recent_activity.id, \
                                           equipment, \
                                           model, \
                                           serial, \
                                           ee, \
                                           assigned_department, \
                                           assigned_room, \
                                           (assigned_room || '-' || assigned_department) AS assigned_location, \
                                           qr_code, \
                                           date_added, \
                                           (added_first_name || ' ' || added_last_name) AS added_name, \
                                           repl_date, \
                                           status, \
                                           current_department, \
                                           current_room, \
                                           (current_room || '-' || current_department) AS current_location, \
                                           scanned_first_name, \
                                           (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                           received_first_name, \
                                           (received_first_name || ' ' || received_last_name) AS received_name, \
                                           action, \
                                           date_of_action, \
                                           SUBSTR(date_of_action, 1, 10) AS doa,\
                                           off_site_location, \
                                           point_of_contact, \
                                           phone_number, \
                                           patient_first_name, \
                                           patient_last_name, \
                                           (patient_first_name || ' ' || patient_last_name) AS patient_name \
                                      FROM inventory \
                                           JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                                     ORDER BY inventory.id, recent_activity.id DESC) ordered_inventory \
                             ORDER BY equipment")
    qr = request.form.get("showinfo")
    equipment_info = db.execute("SELECT qr_code FROM inventory WHERE qr_code = ?", qr)
    unarchive_qr = request.form.get("hidden-unarchive")
    filters = request.args.getlist("filter")
    filterdate = request.args.getlist("filterdate")
    filter_start_da = ""
    filter_end_da = ""
    filter_start_rd = ""
    filter_end_rd = ""
    date_format = "%Y-%m-%d"
    no_date_match = 0

    if request.method == "POST" and qr:

        equipment_info = {"qr_code": equipment_info[0]["qr_code"]}

        return equipment_info
    
    elif request.method == "POST" and request.form.get("invbutton") == "unarchive":

        unarchive_items = request.form.getlist("unarchiveinv")

        # Sends items marked by user to replace page
        if unarchive_items:

            inventory_item = [None] * len(unarchive_items)

            for i in range(len(unarchive_items)): 
                for j in range(len(inventory)): 
                    if unarchive_items[i] == inventory[j]["qr_code"]:
                        inventory_item[i] = inventory[j]
            
            for i in range(len(inventory_item)):

                previous_activity = db.execute("SELECT DISTINCT ON (inventory_id) * \
                                                  FROM recent_activity WHERE inventory_id = ? AND status != 'ARCHIVED' \
                                                 ORDER BY inventory_id, id DESC", inventory_item[i]["equipment_id"])

                # Variables correspond to recent_activity table
                inventory_id = inventory_item[i]["equipment_id"]
                status = previous_activity[0]["status"]
                cdept = previous_activity[0]["current_department"]
                croom = previous_activity[0]["current_room"]
                employee_id = previous_activity[0]["employee_id"]
                sfn = previous_activity[0]["scanned_first_name"]
                sln = previous_activity[0]["scanned_last_name"]
                rfn = previous_activity[0]["received_first_name"]
                rln = previous_activity[0]["received_last_name"]
                action = previous_activity[0]["action"]
                doa = previous_activity[0]["date_of_action"]
                osl = previous_activity[0]["off_site_location"]
                poc = previous_activity[0]["point_of_contact"]
                pn = previous_activity[0]["phone_number"]
                pfn = previous_activity[0]["patient_first_name"]
                pln = previous_activity[0]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                           date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                            cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            return redirect("/archive")
        
    elif request.method == "POST" and unarchive_qr:
        
        for i in range(len(inventory)):
            if inventory[i]["qr_code"] == unarchive_qr:
                previous_activity = db.execute("SELECT DISTINCT ON (inventory_id) * \
                                                  FROM recent_activity WHERE inventory_id = ? AND status != 'ARCHIVED' \
                                                 ORDER BY inventory_id, id DESC", inventory[i]["equipment_id"])
                
                # Variables correspond to recent_activity table
                inventory_id = inventory[i]["equipment_id"]
                status = previous_activity[0]["status"]
                cdept = previous_activity[0]["current_department"]
                croom = previous_activity[0]["current_room"]
                employee_id = previous_activity[0]["employee_id"]
                sfn = previous_activity[0]["scanned_first_name"]
                sln = previous_activity[0]["scanned_last_name"]
                rfn = previous_activity[0]["received_first_name"]
                rln = previous_activity[0]["received_last_name"]
                action = previous_activity[0]["action"]
                doa = previous_activity[0]["date_of_action"]
                osl = previous_activity[0]["off_site_location"]
                poc = previous_activity[0]["point_of_contact"]
                pn = previous_activity[0]["phone_number"]
                pfn = previous_activity[0]["patient_first_name"]
                pln = previous_activity[0]["patient_last_name"]

                db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                        date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                        cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
                return redirect("/archive")
        
    # Return info based on filter selection
    elif request.method == "GET" and filters:
        
        if filters[0] != "Equipment":
            inventory = [i for i in inventory if (i["equipment"] == filters[0])]

        if filters[1] != "Model":
            inventory = [i for i in inventory if (i["model"] == filters[1])]

        if filters[2] != "Serial":
            inventory = [i for i in inventory if (i["serial"] == filters[2])]

        if filters[3] != "EE":
            inventory = [i for i in inventory if (i["ee"] == filters[3])]

        if filters[4] == "Location":
            if filters[5] != "Location":
                inventory = [i for i in inventory if (i["assigned_location"] == filters[5])]

        if filters[4] == "Department":
            if filters[6] != "Department":
                inventory = [i for i in inventory if (i["assigned_department"] == filters[6])]

        if filters[4] == "Room":
            if filters[7] != "Room":
                inventory = [i for i in inventory if (i["assigned_room"] == filters[7])]

        if filterdate[0] != "" and filterdate[1] != "":
            filterdate[0] = datetime.strptime(filterdate[0], date_format)
            filter_start_da = filterdate[0].strftime(date_format)
            filterdate[0] = filterdate[0].strftime("%m/%d/%Y")
            filterdate[1] = datetime.strptime(filterdate[1], date_format)
            filter_end_da = filterdate[1].strftime(date_format)
            filterdate[1] = filterdate[1].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["date_added"] >= filterdate[0] and inventory[i]["date_added"] <= filterdate[1]:
                    inventory = [i for i in inventory if (i["date_added"] >= filterdate[0] and i["date_added"] <= filterdate[1])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        if filters[8] != "Added By":
            inventory = [i for i in inventory if (i["added_name"] == filters[8])]

        if filterdate[2] != "" and filterdate[3] != "":
            filterdate[2] = datetime.strptime(filterdate[2], date_format)
            filter_start_rd = filterdate[2].strftime(date_format)
            filterdate[2] = filterdate[2].strftime("%m/%d/%Y")
            filterdate[3] = datetime.strptime(filterdate[3], date_format)
            filter_end_rd = filterdate[3].strftime(date_format)
            filterdate[3] = filterdate[3].strftime("%m/%d/%Y")
            for i in range(len(inventory)):
                if inventory[i]["repl_date"] >= filterdate[2] and inventory[i]["repl_date"] <= filterdate[3]:
                    inventory = [i for i in inventory if (i["repl_date"] >= filterdate[2] and i["repl_date"] <= filterdate[3])]
                    break
                elif i == len(inventory) - 1:
                    no_date_match = 1

        inventory = [i for i in inventory if (i["status"] == "ARCHIVED")]

        return render_template("archive.html", 
                               inventory=inventory, 
                               filterequipment=filters[0], 
                               filtermodel=filters[1], 
                               filterserial=filters[2], 
                               filteree=filters[3], 
                               filtersbal=filters[4],
                               filteral =filters[5],
                               filterad=filters[6],
                               filterar=filters[7],
                               filter_start_da=filter_start_da, 
                               filter_end_da=filter_end_da, 
                               filteraddedby=filters[8], 
                               filter_start_rd=filter_start_rd, 
                               filter_end_rd=filter_end_rd,
                               no_date_match=no_date_match)

    else: 

        inventory = [i for i in inventory if (i["status"] == "ARCHIVED")]

        return render_template("archive.html", inventory=inventory)

@app.post("/activity_history")
def activity_history():
    if request.form.get("showinfo"):
        qr = request.form.get("showinfo")
    elif request.form.get("showhistory"):
        qr = request.form.get("showhistory")
    showinfo = db.execute("SELECT equipment, \
                                  status, \
                                  current_department, \
                                  current_room, \
                                  scanned_first_name, \
                                  (scanned_first_name || ' ' || scanned_last_name) AS scanned_name, \
                                  received_first_name, \
                                  (received_first_name || ' ' || received_last_name) AS received_name, \
                                  action, \
                                  date_of_action, \
                                  off_site_location, \
                                  point_of_contact, \
                                  phone_number, \
                                  patient_first_name, \
                                  (patient_first_name || ' ' || patient_last_name) AS patient_name \
                             FROM inventory \
                                  JOIN recent_activity ON recent_activity.inventory_id = inventory.id \
                            WHERE qr_code = ? \
                            ORDER BY recent_activity.id DESC", 
                            qr)
    
    return render_template("activity_history.html", showinfo=showinfo)
    

@app.route("/upload_inventory", methods=["GET", "POST"])
@login_required(role="ANY ADMIN")
def upload_inventory():

    adept_id = 0
    data = []
    created_name = []
    created_date = []
    replacement_date = []
    upload_inventory = []
    duplicate_found = False
    existing_inventory = db.execute("SELECT * FROM inventory")

    if request.method == "POST":

        # check if the post request has the file part
        if 'file' not in request.files:
            return apology("No file found.", 400, "/users")
        
        inventory_file = request.files["file"]
        
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if inventory_file.filename == '':
            return apology("No file found.", 400, "/users")
        
        if inventory_file and allowed_file(inventory_file.filename):
            filename = secure_filename(inventory_file.filename)
            inventory_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        else:
            return apology("Invalid file type.", 400, "/users")
        
        with open(f'static/uploads/{filename}', encoding='utf-8') as file:
                csv_file = csv.DictReader(file)
                data = list(csv_file)
        
        for i in range((len(data))):
            # Add item to inventory
            
            inventory = db.execute("SELECT qr_code FROM inventory")
            existingdepts = db.execute("SELECT * FROM department")
            existingrooms = db.execute("SELECT * FROM room")
            skip_data = 0

            generateqr = "".join(random.choice(string.ascii_uppercase + string.digits) for j in range(10))

            for j in range(len(inventory)):
                
                if generateqr == inventory[j]["qr_code"]:
                    generateqr = "".join(random.choice(string.ascii_uppercase + string.digits) for j in range(10))
                    j = 0

            # Variables correspond to inventory table
            equipment = data[i]["Equipment Name"]
            model = data[i]["Model"]
            serial = data[i]["Serial"]
            ee = data[i]["EE #"]

            location_dept = data[i]["Location"]
            location_dept = location_dept[location_dept.index("-") + 1:]

            adept = location_dept

            location_room = data[i]["Location"]
            location_room = location_room[:location_room.index("-")]

            aroom = location_room

            qr_code = generateqr

            date_added = datetime.strptime(data[i]["Created Date"], "%m/%d/%Y")
            date_added = date_added.strftime("%m/%d/%Y")

            added_by = None
            
            created_first_name = data[i]["Created By"]
            created_first_name = created_first_name[created_first_name.index(",") + 1:]

            added_first_name = created_first_name
            added_first_name = string.capwords(added_first_name)
            
            created_last_name = data[i]["Created By"]
            created_last_name = created_last_name[:created_last_name.index(",")]

            added_last_name = created_last_name
            added_last_name = added_last_name.capitalize()

            repl_date = datetime.strptime(data[i]["Replacement Date"], "%m/%d/%Y")
            repl_date = repl_date.strftime("%m/%d/%Y")

            equipment = equipment.strip()
            equipment = equipment.upper()
            model = model.strip()
            model = model.upper()
            serial = serial.strip()
            serial = serial.upper()
            ee = ee.strip()
            ee = ee.upper()
            adept = adept.strip()
            adept = adept.upper()
            aroom = aroom.strip()
            aroom = aroom.upper()

            if len(existing_inventory) != 0:
                for j in range(len(existing_inventory)):
                    if (existing_inventory[j]["equipment"] == equipment and existing_inventory[j]["model"] == model and existing_inventory[j]["serial"] == serial and existing_inventory[j]["ee"] == ee 
                        and existing_inventory[j]["assigned_department"] == adept and existing_inventory[j]["assigned_room"] == aroom and existing_inventory[j]["date_added"] == date_added 
                        and existing_inventory[j]["added_first_name"] == added_first_name and existing_inventory[j]["added_last_name"] == added_last_name and existing_inventory[j]["repl_date"] == repl_date):
                        skip_data = 1
                        break
            
            if skip_data == 1:
                duplicate_found = True
                continue

            upload_inventory.append(data[i])
            created_name.append(created_first_name + " " + created_last_name)
            created_date.append(date_added)
            replacement_date.append(repl_date)

            if existingdepts:
                for k in range(len(existingdepts)):
                    if existingdepts[k]["building"] == adept:
                        adept_id = db.execute("SELECT id FROM department WHERE building = ?", adept)
                        break
                    elif k == len(existingdepts) - 1:
                        db.execute("INSERT INTO department (building) VALUES (?)", adept)
                        adept_id = db.execute("SELECT id FROM department WHERE building = ?", adept)
            else:
                db.execute("INSERT INTO department (building) VALUES (?)", adept)
                adept_id = db.execute("SELECT id FROM department WHERE building = ?", adept)

            if existingrooms:
                for k in range(len(existingrooms)):
                    if existingrooms[k]["rooms"] == aroom and existingrooms[k]["department_id"] == adept_id[0]["id"]:
                        break
                    elif k == len(existingrooms) - 1:
                        db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", adept_id[0]['id'], aroom)
            else:
                db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", adept_id[0]['id'], aroom)

            db.execute("INSERT INTO inventory (equipment, model, serial, ee, assigned_department, assigned_room, qr_code, date_added, added_by, added_first_name, added_last_name, repl_date) \
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", equipment, model, serial, ee, adept, aroom, qr_code, date_added, added_by, added_first_name, added_last_name, repl_date)
            
            # Variables correspond to recent_activity table
            inventory_id = db.execute("SELECT id FROM inventory WHERE qr_code = ?", qr_code)
            inventory_id = inventory_id[0]["id"]
            status = data[i]["Status"]
            cdept = adept
            croom = aroom
            employee_id = added_by
            sfn = session["first_name"]
            sln = session["last_name"]
            rfn = session["first_name"]
            rln = session["last_name"]
            action = "NEW ITEM"
            doa = datetime.today().strftime("%m/%d/%Y %I:%M:%S %p")
            osl = "NA"
            poc = "NA"
            pn = "NA"
            pfn = "NA"
            pln = "NA"

            db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                    date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id, status,
                    cdept, croom, employee_id, sfn, sln, rfn, rln, action, doa, osl, poc, pn, pfn, pln)
            
            img = qrcode.make(qr_code)
            type(img)  # qrcode.image.pil.PilImage
            background = Image.new('RGBA', (290, 340), (255,255,255,255))
            font = ImageFont.truetype("static/fonts/arial.ttf", 11)
            draw = ImageDraw.Draw(background)
            draw.text((20,290), f"Equipment: {equipment}", (0,0,0), font=font)
            draw.text((20,305), f"Model: {model}", (0,0,0), font=font)
            draw.text((20,320), f"Serial: {serial}", (0,0,0), font=font)
            draw.rectangle(((270, 290), (290, 340)), fill="white")
            background.paste(img, (0,1))
            background.save(f"static/qrcodes/{qr_code}.png")
        
        return render_template("upload_inventory.html", inventory=upload_inventory, duplicate_found=duplicate_found, created_name=created_name, created_date=created_date, replacement_date=replacement_date)

    else:

        return render_template("upload_inventory.html")


@app.route("/users", methods=["GET", "POST"])
@login_required(role="ANY ADMIN")
def users():

    users = db.execute("SELECT role_id, \
                               first_name, \
                               last_name, \
                               email, \
                               role_name \
                          FROM \"user\" \
                               JOIN role on role.id = \"user\".role_id")
    user_role = 0
    user_deletion = 0

    if session["user_role"] == "Super Administrator":
        for i in range(len(users)):
            if users[i]["role_id"] == 2 or users[i]["role_id"] == 3 or users[i]["role_id"] == 4:
                user_deletion = 1
    elif session["user_role"] == "Dept Administrator":
        for i in range(len(users)):
            if users[i]["role_id"] == 3 or users[i]["role_id"] == 4:
                user_deletion = 2
    elif session["user_role"] == "Administrator":
        for i in range(len(users)):
            if users[i]["role_id"] == 4:
                user_deletion = 3

    if request.method == "POST":

        deluser = request.form.getlist("deluser")

        if deluser:

            if session["user_role"] == "Super Administrator":
                for i in range(len(deluser)):
                    for j in range(len(users)):
                        if deluser[i] == users[j]["email"]:
                            if users["role_id"] == 1:
                                return apology("Cannot delete user.", 400, "/users")

            elif session["user_role"] == "Dept Administrator":
                for i in range(len(deluser)):
                    for j in range(len(users)):
                        if deluser[i] == users[j]["email"]:
                            if users["role_id"] == 1 or users["role_id"] == 2:
                                return apology("Cannot delete user.", 400, "/users")

            elif session["user_role"] == "Administrator":
                for i in range(len(deluser)):
                    for j in range(len(users)):
                        if deluser[i] == users[j]["email"]:
                            if users["role_id"] == 1 or users["role_id"] == 2 or users["role_id"] == 3:
                                return apology("Cannot delete user.", 400, "/users")
        
            for i in range(len(deluser)):
                db.execute("DELETE FROM \"user\" WHERE email = ?", deluser[i])
            
            return redirect("/users")
        
        else:
            
            if session["user_role"] == "Super Administrator":
                if request.form.get("user_role") == "Dept Administrator":
                    user_role = 2
                elif request.form.get("user_role") == "Administrator":
                    user_role = 3
                elif request.form.get("user_role") == "User":
                    user_role = 4

            elif session["user_role"] == "Dept Administrator":
                if request.form.get("user_role") == "Super Administrator" or request.form.get("user_role") == "Dept Administrator":
                    return apology("Invalid user role.", 400, "/users")

                if request.form.get("user_role") == "Administrator":
                    user_role = 3
                elif request.form.get("user_role") == "User":
                    user_role = 4

            elif session["user_role"] == "Administrator":
                if request.form.get("user_role") == "Super Administrator" or request.form.get("user_role") == "Dept Administrator" or request.form.get("user_role") == "Administrator":
                    return apology("Invalid user role.", 400, "/users")
                
                user_role = 4

            first_name = request.form.get("first_name")
            last_name = request.form.get("last_name")
            email = request.form.get("email")
            password = request.form.get("password")
            if password:
                password = password.strip()
            confirmation = request.form.get("confirmation")
            if confirmation:
                 confirmation = confirmation.strip()

            if not first_name:
                return apology("Fields must not be empty/Please make a selection.", 400, "/users")
            elif not last_name:
                return apology("Fields must not be empty/Please make a selection.", 400, "/users")
            elif not email:
                return apology("Fields must not be empty/Please make a selection.", 400, "/users")
            elif not password:
                return apology("Fields must not be empty/Please make a selection.", 400, "/users")
            elif not confirmation:
                return apology("Fields must not be empty/Please make a selection.", 400, "/users")
            elif password != confirmation:
                return apology("Fields must not be empty/Please make a selection.", 400, "/users")
            elif len(password) < 4:
                return apology("Temporary password must be at least 4 characters in length.", 400, "/users")
                
            first_name = first_name.strip()
            last_name = last_name.strip()
            first_name = first_name.capitalize()
            last_name = last_name.capitalize()
            email = email.strip()

            hashedpassword = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)

            db.execute("INSERT INTO \"user\" (role_id, first_name, last_name, email, password) VALUES (?,?,?,?,?)", user_role, first_name, last_name, email, hashedpassword)
            return redirect("/users")

    else:
        return render_template("users.html", users=users, user_deletion=user_deletion)
    

@app.route("/scan", methods=["GET", "POST"])
@login_required(role="ANY")
def scan():

    qr = request.form.get("hiddenqr")
    qr_code = request.form.getlist("qrcode")
    inventory = db.execute("SELECT * FROM inventory")
    existingdepts = db.execute("SELECT * FROM department")
    existingrooms = db.execute("SELECT * FROM room")
    cdept_id = 0
    cdept = None
    croom = None
    rfn = None
    rln = None
    inventory_id = 0
    if session["user_role"] == "Super Administrator" or session["user_role"] == "Dept Administrator" or session["user_role"] == "Administrator":
        statuses = ["In Use", "Storage", "Loaned", "Off-site", "Out for Repair", "Replace", "Replaced"]
    elif session["user_role"] == "User":
        statuses = ["In Use", "Storage", "Loaned", "Off-site", "Out for Repair"]
    scanned_name = db.execute("SELECT first_name, last_name FROM \"user\" where id = ?", session["user_id"])
    status = request.form.get("statuses")
    if status:
        status = status.upper()
    if status != "OFF-SITE":
        if request.form.get("recipientSelect") == "Yes":
            rfn = request.form.get("rfn")
            rln = request.form.get("rln")
        if request.form.get("recipientSelect") == "No":
            rfn = scanned_name[0]["first_name"]
            rln = scanned_name[0]["last_name"]
        if rfn:
            rfn = rfn.strip()
            rfn = rfn.capitalize()
            rln = rln.strip()
            rln = rln.capitalize()
        if request.form.get("dinput"):
            cdept = request.form.get("dinput")
            cdept = cdept.strip()
            cdept = cdept.upper()
        elif request.form.get("dselect"):
            cdept = request.form.get("dselect")
            cdept = cdept.strip()
            cdept = cdept.upper()
        if request.form.get("rinput"):
            croom = request.form.get("rinput")
            croom = croom.strip()
            croom = croom.upper()
        elif request.form.get("rselect"):
            croom = request.form.get("rselect")
            croom = croom.strip()
            croom = croom.upper()
        osl = "NA"
        poc = "NA"
        pn = "NA"
        pfn = "NA"
        pln = "NA"
    elif status == "OFF-SITE":
        cdept = "NA"
        croom = "NA"
        rfn = "NA"
        rln = "NA"
        if request.form.get("oslinput"):
            osl = request.form.get("oslinput")
        elif request.form.get("oslselect"):
            osl = request.form.get("oslselect")
        osl = osl.strip()
        osl = string.capwords(osl)
        poc = request.form.get("point_of_contact")
        poc = poc.strip()
        poc = string.capwords(poc)
        pn = request.form.get("phone_number")
        pfn = request.form.get("first_name")
        pfn = pfn.capitalize()
        pfn = pfn.strip()
        pln = request.form.get("last_name")
        pln = pln.capitalize()
        pln = pln.strip()
    depts = db.execute("SELECT * FROM department")
    rooms = db.execute("SELECT * FROM room")
    osls = db.execute("SELECT * FROM off_site_location")

    if request.method == "POST" and qr:

        equipment_info = db.execute("SELECT qr_code FROM inventory WHERE qr_code = ?", qr)
        equipment_info = {"qr_code": equipment_info[0]["qr_code"]}

        return jsonify(equipment_info)

    elif request.method == "POST" and qr_code:

        inventory_id = [None] * len(qr_code)

        for i in range(len(qr_code)):
            for j in range(len(inventory)):
                if qr_code[i] == inventory[j]["qr_code"]:
                    inventory_id[i] = inventory[j]["id"]
        
        if not status:
            return apology("Status must be selected.", 400, "/scan")

        if session["user_role"] == "Super Administrator" or session["user_role"] == "Dept Administrator" or session["user_role"] == "Administrator":
            if status == "IN USE" or  status == "STORAGE" or status == "REPLACE" or status == "REPLACED":
                action = "CHECKED IN"
            elif status == "LOANED" or status == "OFF-SITE" or status == "OUT FOR REPAIR":
                action = "CHECKED OUT"
            elif status == "MISSING":
                return apology("Invalid status selection.", 400, "/scan")
        elif session["user_role"] == "User":
            if status == "IN USE" or  status == "STORAGE":
                action = "CHECKED IN"
            elif status == "LOANED" or status == "OFF-SITE" or status == "OUT FOR REPAIR":
                action = "CHECKED OUT"
            elif status == "MISSING" or status == "REPLACE" or status == "REPLACED":
                return apology("Invalid status selection.", 400, "/scan")

        if not cdept:
            return apology("Current department must not be empty.", 400, "/scan")
        elif not croom:
            return apology("Current room must not be empty.", 400, "/scan")
        if not rfn:
            return apology("Recipient first name must not be empty.", 400, "/scan")
        if not rln:
            return apology("Recipient last name must not be empty.", 400, "/scan")
        elif not osl:
            return apology("Off-site location must not be empty.", 400, "/scan")
        elif not poc:
            return apology("Point of contact must not be empty.", 400, "/scan")
        elif not pn:
            return apology("Phone number must not be empty.", 400, "/scan")
        elif not pfn:
            return apology("Patient's first name must not be empty.", 400, "/scan")
        elif not pln:
            return apology("Patient's first name must not be empty.", 400, "/scan")
        
        if existingdepts:
            for i in range(len(existingdepts)):
                if existingdepts[i]["building"] == cdept:
                    cdept_id = db.execute("SELECT id FROM department WHERE building = ?", cdept)
                    break
                elif i == len(existingdepts) - 1:
                    db.execute("INSERT INTO department (building) VALUES (?)", cdept)
                    cdept_id = db.execute("SELECT id FROM department WHERE building = ?", cdept)
        else:
            db.execute("INSERT INTO department (building) VALUES (?)", cdept)
            cdept_id = db.execute("SELECT id FROM department WHERE building = ?", cdept)

        if existingrooms:
            for i in range(len(existingrooms)):
                if existingrooms[i]["rooms"] == croom and existingrooms[i]["department_id"] == cdept_id[0]["id"]:
                    break
                elif i == len(existingrooms) - 1:
                    db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", cdept_id[0]['id'], croom)
        else:
            db.execute("INSERT INTO room (department_id, rooms) VALUES (?,?)", cdept_id[0]['id'], croom)
        
        for i in range(len(inventory_id)):
            db.execute("INSERT INTO recent_activity (inventory_id, status, current_department, current_room, employee_id, scanned_first_name, scanned_last_name, received_first_name, received_last_name, action, \
                    date_of_action, off_site_location, point_of_contact, phone_number, patient_first_name, patient_last_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", inventory_id[i], status, cdept, croom, 
                    session["user_id"], scanned_name[0]["first_name"], scanned_name[0]["last_name"], rfn, rln, action, datetime.today().strftime("%m/%d/%Y %I:%M:%S %p"), osl, poc, pn, pfn, pln)
        
        return render_template("scan.html", depts=depts, rooms=rooms, osls=osls, statuses=statuses)
        
    else:

        return render_template("scan.html", depts=depts, rooms=rooms, osls=osls, statuses=statuses)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return login_apology("Must provide username.", 403, "/login")

        # Ensure password was submitted
        elif not request.form.get("password"):
            return login_apology("Must provide password.", 403, "/login")

        # Query database for username
        user_id = db.execute("SELECT * FROM \"user\" WHERE email = ?", request.form.get("username"))

        # Check if username exists
        if not user_id:
            return login_apology("Invalid username and/or password.", 403, "/login")

        user_role = db.execute("SELECT role_name FROM role WHERE id IN (SELECT role_id FROM \"user\" WHERE id = ?)",  user_id[0]["id"])

        # Ensure username exists and password is correct
        if len(user_id) != 1 or not check_password_hash(user_id[0]["password"], request.form.get("password")):
            return login_apology("Invalid username and/or password.", 403, "/login")

        # Remember which user has logged in
        session["user_id"] = user_id[0]["id"]
        session["user_role"] = user_role[0]["role_name"]
        session["first_name"] = user_id[0]["first_name"]
        session["last_name"] = user_id[0]["last_name"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")
    

@app.route("/manage_password", methods=["GET", "POST"])
@login_required(role="ANY")
def manage_password():
    """Manage password"""

    oldpassword = request.form.get("oldpassword")
    if oldpassword:
        oldpassword = oldpassword.strip()
    newpassword = request.form.get("newpassword")
    if newpassword:
        newpassword = newpassword.strip()
    confirmation = request.form.get("confirmation")
    if confirmation:
        confirmation = confirmation.strip()
    special_characters = "~`!@#$%^&*()_-+=<>,.?/':;"

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure password was submitted
        if not oldpassword:
            return apology("Confirm old password field must not be empty.", 400, "/manage_password")
        elif not newpassword:
            return apology("New password field must not be empty.", 400, "/manage_password")
        elif not confirmation:
            return apology("Confirm new password field must not be empty.", 400, "/manage_password")
        elif oldpassword == newpassword:
            return apology("Old password cannot be the same as new password.", 400, "/manage_password")
        elif newpassword != confirmation:
            return apology("Passwords do not match.", 400, "/manage_password")
        elif len(newpassword) < 8:
            return apology("Passwords must be at least 8 characters in length.", 400, "/manage_password")
        for i in range(len(newpassword)):
            if newpassword[i].isalpha():
                break
            elif i == len(newpassword) - 1:
                return apology("Passwords must contain letters.", 400, "/manage_password")
        for i in range(len(newpassword)):
            if newpassword[i].isdigit():
                break
            elif i == len(newpassword) - 1:
                return apology("Passwords must contain numbers.", 400, "/manage_password")
        if not any(c in special_characters for c in newpassword):
            return apology("Passwords must contain at least one special character/Possible invalid special character.", 400, "/manage_password")

        # Change user password
        newpassword = newpassword.strip()
        hashedpassword = generate_password_hash(newpassword, method='pbkdf2:sha256', salt_length=8)

        db.execute("UPDATE users SET password = ? WHERE id = ?", hashedpassword, session["user_id"])

        # Redirect user to home page
        return redirect("/manage_password")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("manage_password.html")


@app.route("/logout", methods=["GET", "POST"])
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")


@app.context_processor
def inject_menu():

    # Fill in with your actual menu dictionary:
    menu = {"dashboard": "Dashboard", "action": "Scan Item", "search": "Search & History", "inventory": "Inventory", "inventory_Management": "Inventory Management", 
            "manage_Users": "Manage Users"}
    
    return dict(menu=menu)


@app.route('/manifest.json')
def serve_manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')


@app.route('/serviceWorker.js')
def serve_sw():
    return send_file('serviceWorker.js', mimetype='application/javascript')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS