.open coevolution.DB


PRAGMA FOREIGN_KEYS = ON;

CREATE TABLE MUTATIONS (
    culture TEXT NOT NULL,
    generation  INT NOT NULL,
    mutation    TEXT,
    index_ref   INT,
    line_ref    TEXT,
    ref_seq_num TEXT,
    position    INT,
    base    TEXT,
    aa_new_seq  TEXT,
    aa_pos  INT,
    aa_ref_seq  TEXT,
    codon_new_seq   TEXT,
    codon_number    INT,
    codon_position  INT,
    codon_ref_seq   TEXT,
    frequency   FLOAT,
    gene_list   TEXT,
    gene_name   TEXT,
    gene_position   TEXT,
    gene_product    TEXT,
    gene_strand TEXT,
    html_gene_name  BLOB,
    locus_tag   BLOB,
    snp_type    TEXT,
    transl_table    bigint
);