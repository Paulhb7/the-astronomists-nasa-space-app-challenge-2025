# exoplanet_classifier.py
# Python 3.10+
# Requirements:
#   pip install astroquery astropy pandas scikit-learn numpy

import os
import numpy as np
import pandas as pd

from astroquery.nasa_exoplanet_archive import NasaExoplanetArchive
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import f1_score, balanced_accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.utils.class_weight import compute_sample_weight


# --------------------------
# 1) UTILITAIRES DOWNLOAD
# --------------------------

def df_from_table(table):
    df = table.to_pandas()
    df.columns = (
        df.columns
        .str.strip()
        .str.replace(r"\s+", "_", regex=True)
        .str.replace(r"[()]+", "", regex=True)
    )
    return df


def fetch_koi():
    t = NasaExoplanetArchive.query_criteria(
        table="koi",
        select="kepid, kepoi_name, koi_disposition, koi_period, koi_duration, koi_depth, koi_model_snr, "
               "koi_steff, koi_slogg, koi_srad, koi_kepmag, koi_fpflag_nt, koi_fpflag_ss, koi_fpflag_co, koi_fpflag_ec",
        cache=True
    )
    df = df_from_table(t)
    df["mission"] = "KEPLER"
    return df


def fetch_k2():
    """
    K2 Planets and Candidates (table = 'k2pandc').
    Colonnes PS: pl_orbper (jours), pl_trandep (ppm), pl_trandur (jours), st_*, sy_*.
    """
    from astroquery.nasa_exoplanet_archive import NasaExoplanetArchive

    t = NasaExoplanetArchive.query_criteria(
        table="k2pandc",
        select=(
            "epic_hostname, k2_name, hostname, disposition, "
            "pl_orbper, pl_trandep, pl_trandur, "
            "st_teff, st_logg, st_rad, "
            "sy_kepmag, sy_tmag"
        ),
        cache=True
    )
    df = t.to_pandas()
    df.columns = (
        df.columns
        .str.strip()
        .str.replace(r"\s+", "_", regex=True)
        .str.replace(r"[()]+", "", regex=True)
    )

    df.rename(columns={
        "epic_hostname": "epic_hostname",
        "disposition": "Archive_Disposition",
        "pl_orbper": "period",
        "pl_trandur": "duration_d",
        "pl_trandep": "depth",
        "st_teff": "st_teff",
        "st_logg": "st_logg",
        "st_rad": "st_rad",
        "sy_kepmag": "kepmag",
        "sy_tmag": "tmag",
    }, inplace=True)

    df["object_id"] = (
        df.get("epic_hostname")
          .fillna(df.get("k2_name"))
          .fillna(df.get("hostname"))
          .astype(str)
    )

    df["star_id"] = df.get("epic_hostname").fillna(df.get("hostname")).astype(str)

    # magnitude unique
    df["mag"] = df.get("kepmag").fillna(df.get("tmag"))

    df["duration_h"] = df["duration_d"] * 24.0

    df["mission"] = "K2"
    return df

def fetch_toi():
    """
    TESS Objects of Interest (table = 'toi').
    Colonnes clefs (PS schema):
      - tid (TIC ID), tfopwg_disp (disposition),
      - pl_orbper [days], pl_trandurh [hours], pl_trandep [ppm],
      - st_teff, st_logg, st_rad, st_tmag (TESS magnitude).
    Doc colonnes: https://exoplanetarchive.ipac.caltech.edu/docs/API_TOI_columns.html
    """
    from astroquery.nasa_exoplanet_archive import NasaExoplanetArchive

    t = NasaExoplanetArchive.query_criteria(
        table="toi",
        select=(
            "toi, tid, tfopwg_disp, "
            "pl_orbper, pl_trandurh, pl_trandep, "
            "st_teff, st_logg, st_rad, st_tmag"
        ),
        cache=True
    )
    df = t.to_pandas()
    df.columns = (
        df.columns
        .str.strip()
        .str.replace(r"\s+", "_", regex=True)
        .str.replace(r"[()]+", "", regex=True)
    )

    # Renommage vers notre schéma commun
    df.rename(columns={
        "tid": "TIC_ID",
        "tfopwg_disp": "TFOPWG_Disposition",
        "pl_orbper": "Period_days",
        "pl_trandurh": "Duration_hours",
        "pl_trandep": "Depth_ppm",
        "st_tmag": "TESS_Mag"
    }, inplace=True)

    df["mission"] = "TESS"
    return df


# --------------------------
# 2) HARMONISATION
# --------------------------

def harmonize_koi(df):
    return pd.DataFrame({
        "object_id": df.get("kepoi_name", df.index.astype(str)),
        "mission": "KEPLER",
        "star_id": df.get("kepid"),
        "period": df.get("koi_period"),
        "duration": df.get("koi_duration"),
        "depth": df.get("koi_depth"),
        "snr": df.get("koi_model_snr"),
        "st_teff": df.get("koi_steff"),
        "st_logg": df.get("koi_slogg"),
        "st_rad": df.get("koi_srad"),
        "mag": df.get("koi_kepmag"),
        "fpflag_nt": df.get("koi_fpflag_nt"),
        "fpflag_ss": df.get("koi_fpflag_ss"),
        "fpflag_co": df.get("koi_fpflag_co"),
        "fpflag_ec": df.get("koi_fpflag_ec"),
        "label_raw": df.get("koi_disposition"),
    })


def harmonize_k2(df):
    return pd.DataFrame({
        "object_id": df.get("object_id").astype(str),
        "mission": "K2",
        "star_id": df.get("star_id").astype(str),
        "period": df.get("period"),
        "duration": df.get("duration_h"),
        "depth": df.get("depth"),
        "snr": df.get("snr"),
        "st_teff": df.get("st_teff"),
        "st_logg": df.get("st_logg"),
        "st_rad": df.get("st_rad"),
        "mag": df.get("mag"),
        "fpflag_nt": df.get("fpflag_nt"),
        "fpflag_ss": df.get("fpflag_ss"),
        "fpflag_co": df.get("fpflag_co"),
        "fpflag_ec": df.get("fpflag_ec"),
        "label_raw": df.get("Archive_Disposition"),
    })



def harmonize_toi(df):
    def map_toi_label(x):
        if pd.isna(x):
            return None
        x = str(x).upper()
        if x in {"KP", "CP", "CONFIRMED"}:
            return "CONFIRMED"
        if x in {"PC", "APC", "CANDIDATE"}:
            return "CANDIDATE"
        if x in {"FP", "FALSE POSITIVE"}:
            return "FALSE POSITIVE"
        return None

    return pd.DataFrame({
        "object_id": df.get("toi").astype(str),
        "mission": "TESS",
        "star_id": df.get("TIC_ID"),
        "period": df.get("Period_days"),
        "duration": df.get("Duration_hours"),
        "depth": df.get("Depth_ppm"),
        "snr": df.get("SNR"),
        "st_teff": df.get("st_teff"),
        "st_logg": df.get("st_logg"),
        "st_rad": df.get("st_rad"),
        "mag": df.get("TESS_Mag"),
        "fpflag_nt": df.get("fpflag_nt"),
        "fpflag_ss": df.get("fpflag_ss"),
        "fpflag_co": df.get("fpflag_co"),
        "fpflag_ec": df.get("fpflag_ec"),
        "label_raw": df.get("TFOPWG_Disposition").map(map_toi_label),
    })


# --------------------------
# 3) PIPELINE ML
# --------------------------

def run_classifier(harm):
    from sklearn.preprocessing import QuantileTransformer, OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.impute import SimpleImputer
    from sklearn.ensemble import HistGradientBoostingClassifier
    from sklearn.metrics import f1_score, balanced_accuracy_score
    from sklearn.model_selection import StratifiedGroupKFold
    from sklearn.utils.class_weight import compute_sample_weight

    label_map = {"CONFIRMED": 2, "CANDIDATE": 1, "FALSE POSITIVE": 0}
    harm = harm[harm["label_raw"].isin(label_map.keys())].copy()
    harm["label"] = harm["label_raw"].map(label_map).astype(int)

    for c in ["period", "duration", "depth"]:
        if c in harm.columns:
            harm.loc[(~harm[c].isna()) & (harm[c].astype(float) <= 0), c] = np.nan

    base_num_cols = [
        "period", "duration", "depth", "snr",
        "st_teff", "st_logg", "st_rad", "mag",
        "fpflag_nt", "fpflag_ss", "fpflag_co", "fpflag_ec",
    ]

    eps = 1e-6
    harm["log_period"]          = np.log10(harm["period"].astype(float) + eps)
    harm["log_duration_h"]      = np.log10(harm["duration"].astype(float) + eps)
    harm["log_depth_ppm"]       = np.log10(harm["depth"].astype(float) + eps)
    harm["depth_over_duration"] = harm["depth"].astype(float) / (harm["duration"].astype(float) + eps)

    derived_cols = ["log_period", "log_duration_h", "log_depth_ppm", "depth_over_duration"]
    base_num_cols = [c for c in base_num_cols if c in harm.columns]
    all_num_cols = base_num_cols + derived_cols

    cat_cols = ["mission"]

    y = harm["label"].values
    groups_star = harm["star_id"].astype(str).values
    groups_mission = harm["mission"].values

    clf = HistGradientBoostingClassifier(
        learning_rate=0.08,
        max_iter=500,
        max_leaf_nodes=31,
        early_stopping=True,
        random_state=42
    )

    cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
    f1s, bals = [], []

    for fold, (tr, te) in enumerate(cv.split(harm, y, groups_star), 1):
        df_tr = harm.iloc[tr].copy()
        df_te = harm.iloc[te].copy()

        num_cols_fit = [c for c in all_num_cols if df_tr[c].notna().any()]
        pre = ColumnTransformer([
            ("num", Pipeline([
                ("imp", SimpleImputer(strategy="median")),
                ("qt",  QuantileTransformer(output_distribution="normal",
                                            subsample=200_000, random_state=42)),
            ]), num_cols_fit),
            ("cat", Pipeline([
                ("imp", SimpleImputer(strategy="most_frequent")),
                ("oh", OneHotEncoder(handle_unknown="ignore"))
            ]), cat_cols),
        ])

        pipe = Pipeline([("pre", pre), ("clf", clf)])
        sw = compute_sample_weight(class_weight="balanced", y=y[tr])
        pipe.fit(df_tr[num_cols_fit + cat_cols], y[tr], clf__sample_weight=sw)
        y_hat = pipe.predict(df_te[num_cols_fit + cat_cols])

        f1s.append(f1_score(y[te], y_hat, average="macro"))
        bals.append(balanced_accuracy_score(y[te], y_hat))
        print(f"[Fold {fold}] F1-macro={f1s[-1]:.3f}, BalAcc={bals[-1]:.3f}")

    print(f"\nCV results: F1-macro={np.mean(f1s):.3f}±{np.std(f1s):.3f}, "
          f"BalAcc={np.mean(bals):.3f}±{np.std(bals):.3f}")

    # ---------- Leave-One-Mission-Out () ----------
    print("\nLeave-One-Mission-Out:")
    for m in np.unique(groups_mission):
        tr_idx = np.where(groups_mission != m)[0]
        te_idx = np.where(groups_mission == m)[0]
        if len(te_idx) < 50:
            continue

        df_tr = harm.iloc[tr_idx].copy()
        df_te = harm.iloc[te_idx].copy()

        num_cols_fit = [c for c in all_num_cols if df_tr[c].notna().any()]

        pre = ColumnTransformer([
            ("num", Pipeline([
                ("imp", SimpleImputer(strategy="median")),
                ("qt",  QuantileTransformer(output_distribution="normal",
                                            subsample=200_000, random_state=42)),
            ]), num_cols_fit),
        ])

        pipe = Pipeline([("pre", pre), ("clf", clf)])
        sw = compute_sample_weight(class_weight="balanced", y=y[tr_idx])

        pipe.fit(df_tr[num_cols_fit], y[tr_idx], clf__sample_weight=sw)
        y_hat = pipe.predict(df_te[num_cols_fit])

        f1 = f1_score(y[te_idx], y_hat, average="macro")
        bal = balanced_accuracy_score(y[te_idx], y_hat)
        print(f"Train≠{m} → Test={m}: F1-macro={f1:.3f}, BalAcc={bal:.3f}")

# --------------------------
# 3bis) INFÉRENCE (entraîner tout + sauvegarder, puis charger et prédire)
# --------------------------
from pathlib import Path
import joblib

LABEL_MAP = {"CONFIRMED": 2, "CANDIDATE": 1, "FALSE POSITIVE": 0}
INV_LABEL_MAP = {v: k for k, v in LABEL_MAP.items()}

BASE_NUM_COLS_ALL = [
    "period","duration","depth","snr",
    "st_teff","st_logg","st_rad","mag",
    "fpflag_nt","fpflag_ss","fpflag_co","fpflag_ec",
]
CAT_COLS = ["mission"]

def _feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    eps = 1e-6
    df = df.copy()
    for c in ["period","duration","depth"]:
        if c in df.columns:
            df.loc[(~df[c].isna()) & (df[c].astype(float) <= 0), c] = np.nan
    df["log_period"]          = np.log10(df["period"].astype(float)   + eps)
    df["log_duration_h"]      = np.log10(df["duration"].astype(float) + eps)
    df["log_depth_ppm"]       = np.log10(df["depth"].astype(float)    + eps)
    df["depth_over_duration"] = df["depth"].astype(float) / (df["duration"].astype(float) + eps)
    return df

def _build_preprocessor(num_cols_fit, cat_cols):
    from sklearn.preprocessing import QuantileTransformer, OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.impute import SimpleImputer
    return ColumnTransformer([
        ("num", Pipeline([
            ("imp", SimpleImputer(strategy="median")),
            ("qt",  QuantileTransformer(output_distribution="normal",
                                        subsample=200_000, random_state=42)),
        ]), num_cols_fit),
        ("cat", Pipeline([
            ("imp", SimpleImputer(strategy="most_frequent")),
            ("oh", OneHotEncoder(handle_unknown="ignore"))
        ]), cat_cols),
    ])

def train_final_model_and_save(harm: pd.DataFrame,
                               model_dir: str = "models",
                               model_name: str = "exoplanet_hgb.pkl") -> str:
    Path(model_dir).mkdir(parents=True, exist_ok=True)
    df = harm[harm["label_raw"].isin(LABEL_MAP.keys())].copy()
    df["label"] = df["label_raw"].map(LABEL_MAP).astype(int)

    # colonnes numériques réellement dispo dans le jeu
    base_num_cols = [c for c in BASE_NUM_COLS_ALL if c in df.columns]

    # features dérivées (identiques à run_classifier)
    df = _feature_engineering(df)
    derived_cols = ["log_period","log_duration_h","log_depth_ppm","depth_over_duration"]
    all_num_cols = [c for c in (base_num_cols + derived_cols) if c in df.columns]

    pre = _build_preprocessor(all_num_cols, CAT_COLS)

    clf = HistGradientBoostingClassifier(
        learning_rate=0.08, max_iter=500, max_leaf_nodes=31,
        early_stopping=True, random_state=42
    )
    pipe = Pipeline([("pre", pre), ("clf", clf)])

    sw = compute_sample_weight(class_weight="balanced", y=df["label"].values)
    pipe.fit(df[all_num_cols + CAT_COLS], df["label"].values, clf__sample_weight=sw)

    out_path = str(Path(model_dir) / model_name)
    joblib.dump({
        "pipeline": pipe,
        "all_num_cols": all_num_cols,
        "cat_cols": CAT_COLS,
        "label_map": LABEL_MAP,
    }, out_path)
    return out_path

def load_model(model_path: str):
    bundle = joblib.load(model_path)
    
    # Handle both dict format (new) and tuple format (old)
    if isinstance(bundle, dict):
        return bundle["pipeline"], bundle["all_num_cols"], bundle["cat_cols"], bundle["label_map"]
    elif isinstance(bundle, tuple) and len(bundle) == 4:
        # Old format: (model/pipeline, num_cols, cat_cols, all_feature_cols)
        model, num_cols, cat_cols, all_feature_cols = bundle
        # Create a label_map since it wasn't saved in old format
        label_map = {"CONFIRMED": 2, "CANDIDATE": 1, "FALSE POSITIVE": 0}
        return model, num_cols, cat_cols, label_map
    else:
        raise ValueError(f"Unknown model format: {type(bundle)} with {len(bundle) if hasattr(bundle, '__len__') else 'no length'} elements")

def predict_from_df(model, all_num_cols, cat_cols, df_new: pd.DataFrame) -> pd.DataFrame:
    dfX = _feature_engineering(df_new)
    for c in set(all_num_cols + cat_cols):
        if c not in dfX.columns:
            dfX[c] = np.nan
    proba = model.predict_proba(dfX[all_num_cols + cat_cols])
    pred  = model.predict(dfX[all_num_cols + cat_cols]).astype(int)
    labels = pd.Series(pred).map(INV_LABEL_MAP)
    out = df_new.copy()
    out["pred_label"] = labels.values
    out["p_FALSE_POSITIVE"] = proba[:, LABEL_MAP["FALSE POSITIVE"]]
    out["p_CANDIDATE"]      = proba[:, LABEL_MAP["CANDIDATE"]]
    out["p_CONFIRMED"]      = proba[:, LABEL_MAP["CONFIRMED"]]
    return out

# --------------------------
# 4) MAIN
# --------------------------
if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)

    print("Fetching NASA catalogs via astroquery...")
    koi_df = fetch_koi()
    k2_df  = fetch_k2()
    toi_df = fetch_toi()

    koi_df.to_csv("data/cumulative_koi.csv", index=False)
    k2_df.to_csv("data/k2planets.csv", index=False)
    toi_df.to_csv("data/toi.csv", index=False)

    print("Harmonizing...")
    harm = pd.concat([
        harmonize_koi(koi_df),
        harmonize_k2(k2_df),
        harmonize_toi(toi_df)
    ], ignore_index=True)

    num_cols_all = harm.select_dtypes(include=[np.number]).columns
    nan_ratio = harm[num_cols_all].isna().mean()
    cols_to_drop = nan_ratio[nan_ratio > 0.95].index.tolist()
    if cols_to_drop:
        print(f"[Info] Dropping quasi-empty numeric columns (>95% NaN): {cols_to_drop}")
        harm.drop(columns=cols_to_drop, inplace=True)

    harm.to_csv("data/exoplanets_harmonized.csv", index=False)

    print(f"Harmonized dataset shape: {harm.shape}")
    print(harm["label_raw"].value_counts())

    print("\nRunning classifier (CV)...")
    run_classifier(harm)

    # >>> NOUVEAU : entraînement final + sauvegarde du pipeline complet
    print("\nTraining final model for inference and saving it...")
    model_path = train_final_model_and_save(harm)
    print(f"Model saved to: {model_path}")