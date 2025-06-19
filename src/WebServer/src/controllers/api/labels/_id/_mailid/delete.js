import { removeMailFromLabelById } from "../../../../../models/label.model.js";


export async function deleteLabelMailAttachment(req, res) {
  const userId = req.userId;
  const { id: labelId, mailId } = req.params;

  if (!mailId) {
    return res
      .status(400)
      .json({ error: "Missing required URL param: mailId" });
  }

  const { status, error } = removeMailFromLabelById(userId, labelId, mailId);

  if (error) {
    return res
      .status(status ?? 400)
      .json({ error });
  }

  // Successfully removed the mail from the label
  return res
    .status(status)
    .send();
}
