const localeDateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

export const formatDate = function (str: string) {
  const date = new Date(str + "T00:00:00");
  if (isFinite(+date)) {
    const dateFormatPe = date.toLocaleDateString("es-PE", localeDateOptions);
    return dateFormatPe[0].toUpperCase() + dateFormatPe.slice(1);
  } else {
    // No es una fecha valida
    return str;
  }
};